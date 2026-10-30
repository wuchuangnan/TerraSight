// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { IScreenRecordingHost } from "@lichtblick/suite-base/services/screenRecording/ScreenRecordingHost";

import { Desktop } from "../../common/types";

const FIRST_FRAME_TIMEOUT_MS = 5000;

async function decodeJpeg(data: Uint8Array): Promise<ImageBitmap> {
  return await createImageBitmap(new Blob([new Uint8Array(data)], { type: "image/jpeg" }));
}

/**
 * Screen recording host backed by Electron: the main process rasterizes the window's
 * own page via webContents.capturePage (no OS screen-recording permission needed) and
 * streams JPEG frames over IPC. Frames are drawn onto a canvas whose captureStream is
 * fed to the recorder.
 */
export class DesktopScreenRecordingHost implements IScreenRecordingHost {
  #bridge: Desktop;

  public constructor(bridge: Desktop) {
    this.#bridge = bridge;
  }

  public async captureAppWindowStream(frameRate: number): Promise<MediaStream> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context is unavailable");
    }

    let unregister = this.#bridge.onWindowCaptureFrame((data) => {
      void decodeJpeg(data).then((bitmap) => {
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
      });
    });
    const cleanup = (): void => {
      unregister();
      void this.#bridge.stopWindowCapture();
    };

    // The first frame arrives before the stream exists; wait for it to size the canvas.
    const firstFrame = new Promise<Uint8Array>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Timed out waiting for the first captured frame"));
      }, FIRST_FRAME_TIMEOUT_MS);
      const innerUnregister = this.#bridge.onWindowCaptureFrame((data) => {
        clearTimeout(timer);
        innerUnregister();
        resolve(data);
      });
    });

    await this.#bridge.startWindowCapture(frameRate);

    try {
      const bitmap = await decodeJpeg(await firstFrame);
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
    } catch (error) {
      cleanup();
      throw error;
    }

    const stream = canvas.captureStream(frameRate);
    const track = stream.getVideoTracks()[0];
    if (track) {
      // The recorder stops tracks via track.stop(), which does not fire "ended" —
      // wrap stop() so the IPC capture is always torn down with the stream.
      const originalStop = track.stop.bind(track);
      track.stop = () => {
        cleanup();
        unregister = () => {};
        originalStop();
      };
    }
    return stream;
  }

  public async saveRecording(
    defaultFileName: string,
    data: Uint8Array,
  ): Promise<string | undefined> {
    return await this.#bridge.saveRecording(defaultFileName, data);
  }
}
