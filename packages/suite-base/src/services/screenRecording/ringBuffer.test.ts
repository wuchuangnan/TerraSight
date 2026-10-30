// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { alignToFirstKeyframe, trimChunksToWindow, EncodedChunkLike } from "./ringBuffer";

function chunk(timestampUs: number, type: "key" | "delta" = "delta"): EncodedChunkLike {
  return { timestamp: timestampUs, type };
}

/** Builds a chunk sequence with a keyframe every `gop` chunks, 0.5s apart. */
function sequence(count: number, gop: number, startUs = 0, stepUs = 500_000): EncodedChunkLike[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: startUs + i * stepUs,
    type: i % gop === 0 ? ("key" as const) : ("delta" as const),
  }));
}

describe("trimChunksToWindow", () => {
  it("returns all chunks when the buffer is shorter than the window", () => {
    const chunks = sequence(10, 4); // 4.5s total
    expect(trimChunksToWindow(chunks, 20e6)).toEqual(chunks);
  });

  it("keeps at least windowUs of video ending at the newest chunk", () => {
    const chunks = sequence(120, 4); // 60s, keyframe every 2s
    const trimmed = trimChunksToWindow(chunks, 20e6);
    const newest = chunks[chunks.length - 1]!.timestamp;
    expect(trimmed[0]!.type).toBe("key");
    expect(newest - trimmed[0]!.timestamp).toBeGreaterThanOrEqual(20e6);
  });

  it("always starts on a keyframe", () => {
    const chunks = sequence(120, 4);
    const trimmed = trimChunksToWindow(chunks, 5e6);
    expect(trimmed[0]!.type).toBe("key");
  });

  it("keeps everything when no keyframe is old enough", () => {
    // single keyframe at the start, long window — nothing droppable
    const chunks = [chunk(0, "key"), ...sequence(9, 1000, 500_000)];
    const trimmed = trimChunksToWindow(chunks, 20e6);
    expect(trimmed).toEqual(chunks);
  });

  it("handles an empty buffer", () => {
    expect(trimChunksToWindow([], 20e6)).toEqual([]);
  });
});

describe("alignToFirstKeyframe", () => {
  it("drops leading delta chunks", () => {
    const chunks = [chunk(0), chunk(500_000), chunk(1_000_000, "key"), chunk(1_500_000)];
    expect(alignToFirstKeyframe(chunks)).toEqual(chunks.slice(2));
  });

  it("returns empty when there is no keyframe", () => {
    expect(alignToFirstKeyframe([chunk(0), chunk(1)])).toEqual([]);
  });

  it("keeps everything when already starting on a keyframe", () => {
    const chunks = [chunk(0, "key"), chunk(1)];
    expect(alignToFirstKeyframe(chunks)).toEqual(chunks);
  });
});
