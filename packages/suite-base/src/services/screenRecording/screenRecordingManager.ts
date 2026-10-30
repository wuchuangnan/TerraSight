// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useCallback, useSyncExternalStore } from "react";

import { ScreenRecorder, ScreenRecorderState } from "./ScreenRecorder";

export interface ScreenRecordingSettings {
  loopSeconds: number;
  trailingSeconds: number;
  frameRate: number;
}

interface ScreenRecordingSnapshot {
  state: ScreenRecorderState;
  /** Milliseconds elapsed since recording started. */
  elapsedMs: number;
}

type Listener = () => void;

/**
 * Module-level manager holding the single ScreenRecorder instance so recording
 * survives component unmounts (e.g. layout changes) and can be controlled from
 * anywhere in the app.
 */
class ScreenRecordingManager {
  #recorder?: ScreenRecorder;
  #snapshot: ScreenRecordingSnapshot = { state: "idle", elapsedMs: 0 };
  #listeners = new Set<Listener>();
  #elapsedTimer?: ReturnType<typeof setInterval>;

  public getSnapshot = (): ScreenRecordingSnapshot => {
    return this.#snapshot;
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  #emit(state: ScreenRecorderState): void {
    this.#snapshot = { state, elapsedMs: this.#recorder?.getElapsedMs() ?? 0 };
    this.#listeners.forEach((listener) => {
      listener();
    });
  }

  #startElapsedTimer(): void {
    this.#stopElapsedTimer();
    this.#elapsedTimer = setInterval(() => {
      if (this.#recorder && this.#snapshot.state !== "idle") {
        this.#snapshot = {
          state: this.#snapshot.state,
          elapsedMs: this.#recorder.getElapsedMs(),
        };
        this.#listeners.forEach((listener) => {
          listener();
        });
      }
    }, 500);
  }

  #stopElapsedTimer(): void {
    if (this.#elapsedTimer != undefined) {
      clearInterval(this.#elapsedTimer);
      this.#elapsedTimer = undefined;
    }
  }

  public async start(settings: ScreenRecordingSettings, stream: MediaStream): Promise<void> {
    if (this.#recorder && this.#snapshot.state !== "idle") {
      return;
    }
    this.#recorder = new ScreenRecorder({
      ...settings,
      onStateChange: (state) => {
        this.#emit(state);
        if (state === "idle") {
          this.#stopElapsedTimer();
        }
      },
    });
    try {
      await this.#recorder.start(stream);
    } catch (error) {
      this.#emit("idle");
      throw error;
    }
    this.#startElapsedTimer();
  }

  /** Records the trailing period and resolves with the final MP4 blob. */
  public async stopAndSave(): Promise<Blob> {
    if (!this.#recorder) {
      throw new Error("Not recording");
    }
    return await this.#recorder.stopAndSave();
  }

  public cancel(): void {
    this.#recorder?.cancel();
  }
}

export const screenRecordingManager = new ScreenRecordingManager();

export function useScreenRecording(): ScreenRecordingSnapshot & {
  start: (settings: ScreenRecordingSettings, stream: MediaStream) => Promise<void>;
  stopAndSave: () => Promise<Blob>;
  cancel: () => void;
} {
  const snapshot = useSyncExternalStore(
    screenRecordingManager.subscribe,
    screenRecordingManager.getSnapshot,
  );
  return {
    ...snapshot,
    start: useCallback(async (settings: ScreenRecordingSettings, stream: MediaStream) => {
      await screenRecordingManager.start(settings, stream);
    }, []),
    stopAndSave: useCallback(async () => await screenRecordingManager.stopAndSave(), []),
    cancel: useCallback(() => {
      screenRecordingManager.cancel();
    }, []),
  };
}
