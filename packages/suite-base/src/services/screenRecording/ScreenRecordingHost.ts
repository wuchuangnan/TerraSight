// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { createContext, useContext } from "react";

import { downloadFiles } from "@lichtblick/suite-base/util/download";

/**
 * Platform-specific capabilities needed by screen recording. The desktop app provides
 * an implementation backed by Electron (native save dialog, own-window capture via
 * webContents.capturePage — no OS screen-recording permission needed); the default
 * web implementation downloads the file and captures via getDisplayMedia (the browser
 * shows its own picker/prompt).
 */
export interface IScreenRecordingHost {
  /**
   * Produce a video stream of the app window at the requested frame rate. The caller
   * takes ownership and stops the stream's tracks when done.
   */
  captureAppWindowStream(frameRate: number): Promise<MediaStream>;

  /**
   * Persist a recording. Returns the path the file was saved to, or undefined if the
   * user cancelled the save dialog.
   */
  saveRecording(defaultFileName: string, data: Uint8Array): Promise<string | undefined>;
}

const webScreenRecordingHost: IScreenRecordingHost = {
  async captureAppWindowStream(frameRate) {
    return await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: frameRate, max: frameRate } },
      audio: false,
    });
  },
  async saveRecording(defaultFileName, data) {
    downloadFiles([{ blob: new Blob([new Uint8Array(data)]), fileName: defaultFileName }]);
    return defaultFileName;
  },
};

export const ScreenRecordingHostContext =
  createContext<IScreenRecordingHost>(webScreenRecordingHost);

export function useScreenRecordingHost(): IScreenRecordingHost {
  return useContext(ScreenRecordingHostContext);
}
