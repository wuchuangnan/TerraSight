// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { ArrayBufferTarget, Muxer } from "mp4-muxer";

import { alignToFirstKeyframe, trimChunksToWindow } from "./ringBuffer";

export type ScreenRecorderState = "idle" | "recording" | "stopping";

export interface ScreenRecorderOptions {
  /** How many seconds of video are kept in the rolling buffer while recording. */
  loopSeconds: number;
  /** How many seconds are still recorded after stopAndSave() is requested. */
  trailingSeconds: number;
  /** Captured frames per second. */
  frameRate: number;
  onStateChange?: (state: ScreenRecorderState) => void;
}

interface BufferedChunk {
  chunk: EncodedVideoChunk;
  timestamp: number;
  type: "key" | "delta";
}

/** Candidate H.264 codec strings, in order of preference (High/Main/Baseline, levels 5.1/4.0). */
const AVC_CODEC_CANDIDATES = [
  "avc1.640033",
  "avc1.4d0033",
  "avc1.42e033",
  "avc1.640028",
  "avc1.4d0028",
  "avc1.42e028",
];

const VIDEO_BITRATE = 8_000_000;

/** Frames between forced keyframes. Two seconds at the capture frame rate. */
function gopSize(frameRate: number): number {
  return Math.max(1, Math.round(frameRate * 2));
}

/**
 * Records the app window to H.264 using WebCodecs and keeps the last `loopSeconds` of
 * encoded video in memory. When `stopAndSave()` is called, recording continues for
 * `trailingSeconds` and the buffered chunks are muxed into a single MP4 blob.
 */
export class ScreenRecorder {
  #options: ScreenRecorderOptions;
  #state: ScreenRecorderState = "idle";

  #stream?: MediaStream;
  #reader?: ReadableStreamDefaultReader<VideoFrame>;
  #encoder?: VideoEncoder;

  #chunks: BufferedChunk[] = [];
  #decoderConfig?: VideoDecoderConfig;
  #width = 0;
  #height = 0;

  #startedAt = 0;
  /** Capture-clock timestamp (us) at which the trailing period ends. */
  #stopDeadlineUs?: number;
  #stopResolve?: (blob: Blob) => void;
  #stopReject?: (error: Error) => void;

  public constructor(options: ScreenRecorderOptions) {
    this.#options = options;
  }

  public getState(): ScreenRecorderState {
    return this.#state;
  }

  /** Milliseconds elapsed since recording started, for UI display. */
  public getElapsedMs(): number {
    return this.#state === "idle" ? 0 : Date.now() - this.#startedAt;
  }

  #setState(state: ScreenRecorderState): void {
    this.#state = state;
    this.#options.onStateChange?.(state);
  }

  /**
   * Starts encoding frames from the given capture stream. The caller owns the stream;
   * it is stopped when recording finishes or fails.
   */
  public async start(stream: MediaStream): Promise<void> {
    if (this.#state !== "idle") {
      return;
    }
    const { frameRate } = this.#options;

    const track = stream.getVideoTracks()[0];
    if (!track) {
      stream.getTracks().forEach((t) => {
        t.stop();
      });
      throw new Error("No video track in captured stream");
    }

    const settings = track.getSettings();
    this.#width = settings.width ?? 1280;
    this.#height = settings.height ?? 720;

    const encoder = new VideoEncoder({
      output: (chunk, meta) => {
        this.#onChunk(chunk, meta);
      },
      error: (error) => {
        this.#fail(error);
      },
    });

    const baseConfig = {
      width: this.#width,
      height: this.#height,
      framerate: frameRate,
      bitrate: VIDEO_BITRATE,
    };
    let configured = false;
    for (const codec of AVC_CODEC_CANDIDATES) {
      const config: VideoEncoderConfig = { ...baseConfig, codec };
      const support = await VideoEncoder.isConfigSupported(config);
      if (support.supported === true) {
        encoder.configure(config);
        configured = true;
        break;
      }
    }
    if (!configured) {
      stream.getTracks().forEach((t) => {
        t.stop();
      });
      throw new Error("H.264 encoding is not supported on this system");
    }

    this.#stream = stream;
    this.#encoder = encoder;
    this.#chunks = [];
    this.#decoderConfig = undefined;
    this.#stopDeadlineUs = undefined;
    this.#startedAt = Date.now();
    this.#setState("recording");

    track.addEventListener("ended", () => {
      // User revoked the capture (e.g. via the browser UI) mid-recording.
      this.#fail(new Error("Screen capture was stopped"));
    });

    // The repo's tsconfig includes lib.webworker, whose MediaStreamTrackProcessorInit
    // omits the `track` field (workers receive tracks via postMessage). The DOM API
    // accepts it, so assert the init shape here.
    const processor = new MediaStreamTrackProcessor({
      track,
    } as MediaStreamTrackProcessorInit);
    this.#reader = processor.readable.getReader();
    void this.#pumpFrames();
  }

  /**
   * Stops after recording `trailingSeconds` more and returns the muxed MP4
   * covering the buffered loop plus the trailing period.
   */
  public async stopAndSave(): Promise<Blob> {
    if (this.#state !== "recording") {
      throw new Error("Not recording");
    }
    this.#setState("stopping");
    const last = this.#chunks[this.#chunks.length - 1];
    if (last) {
      this.#stopDeadlineUs = last.timestamp + this.#options.trailingSeconds * 1e6;
    }
    return await new Promise<Blob>((resolve, reject) => {
      this.#stopResolve = resolve;
      this.#stopReject = reject;
    });
  }

  /** Aborts recording immediately and discards all buffered video. */
  public cancel(): void {
    this.#fail(undefined);
  }

  #onChunk(chunk: EncodedVideoChunk, meta?: EncodedVideoChunkMetadata): void {
    if (this.#decoderConfig == undefined && meta?.decoderConfig != undefined) {
      this.#decoderConfig = meta.decoderConfig;
    }
    this.#chunks.push({ chunk, timestamp: chunk.timestamp, type: chunk.type });

    if (this.#state === "recording") {
      this.#chunks = trimChunksToWindow(this.#chunks, this.#options.loopSeconds * 1e6);
      return;
    }

    if (this.#state === "stopping") {
      this.#stopDeadlineUs ??= chunk.timestamp + this.#options.trailingSeconds * 1e6;
      if (chunk.timestamp >= this.#stopDeadlineUs) {
        void this.#finalize();
      }
    }
  }

  async #pumpFrames(): Promise<void> {
    const reader = this.#reader;
    const encoder = this.#encoder;
    if (!reader || !encoder) {
      return;
    }
    const gop = gopSize(this.#options.frameRate);
    let frameCount = 0;
    try {
      for (;;) {
        const { value: frame, done } = await reader.read();
        if (done) {
          break;
        }
        try {
          if (encoder.state === "configured") {
            encoder.encode(frame, { keyFrame: frameCount % gop === 0 });
          }
        } finally {
          frame.close();
        }
        frameCount++;
      }
    } catch {
      // reader.cancel() during teardown rejects the pending read — expected
    }
  }

  async #finalize(): Promise<void> {
    const resolve = this.#stopResolve;
    const reject = this.#stopReject;
    this.#stopResolve = undefined;
    this.#stopReject = undefined;
    this.#stopDeadlineUs = undefined;

    try {
      const encoder = this.#encoder;
      this.#teardownCapture();
      if (encoder?.state === "configured") {
        await encoder.flush();
      }
      encoder?.close();

      const chunks = alignToFirstKeyframe(this.#chunks);
      const decoderConfig = this.#decoderConfig;
      if (chunks.length === 0 || decoderConfig == undefined) {
        throw new Error("No video was captured");
      }

      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: "avc",
          width: this.#width,
          height: this.#height,
        },
        fastStart: "in-memory",
        firstTimestampBehavior: "offset",
      });
      chunks.forEach(({ chunk }, index) => {
        muxer.addVideoChunk(chunk, index === 0 ? { decoderConfig } : undefined);
      });
      muxer.finalize();

      const blob = new Blob([muxer.target.buffer], { type: "video/mp4" });
      this.#chunks = [];
      this.#setState("idle");
      resolve?.(blob);
    } catch (error) {
      this.#setState("idle");
      reject?.(error as Error);
    }
  }

  #fail(error?: Error): void {
    const reject = this.#stopReject;
    this.#stopResolve = undefined;
    this.#stopReject = undefined;
    this.#stopDeadlineUs = undefined;
    this.#teardownCapture();
    if (this.#encoder?.state === "configured") {
      this.#encoder.close();
    }
    this.#encoder = undefined;
    this.#chunks = [];
    this.#setState("idle");
    if (error != undefined && reject != undefined) {
      reject(error);
    }
  }

  #teardownCapture(): void {
    void this.#reader?.cancel().catch(() => undefined);
    this.#reader = undefined;
    this.#stream?.getTracks().forEach((track) => {
      track.stop();
    });
    this.#stream = undefined;
  }
}
