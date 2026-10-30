// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

import installChromeExtensions from "./installChromeExtensions";

jest.mock("electron-devtools-installer", () => ({
  __esModule: true,
  default: jest.fn(),
  REACT_DEVELOPER_TOOLS: "react-developer-tools",
}));

describe("installChromeExtensions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("continues without the extension when installation fails", async () => {
    (installExtension as jest.Mock).mockRejectedValue(new Error("network unavailable"));

    await expect(installChromeExtensions()).resolves.toBeUndefined();
    expect(installExtension).toHaveBeenCalledWith(REACT_DEVELOPER_TOOLS);
    expect(console.warn).toHaveBeenCalledWith(
      "Warning: extension installation failed. Continuing without React Developer Tools.",
      expect.any(Error),
    );
    (console.warn as jest.Mock).mockClear();
  });
});
