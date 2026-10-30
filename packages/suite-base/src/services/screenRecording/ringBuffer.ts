// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/** Minimal structural view of an EncodedVideoChunk, so the ring buffer stays unit-testable. */
export interface EncodedChunkLike {
  type: "key" | "delta";
  /** microseconds */
  timestamp: number;
}

/**
 * Trims a GOP-aligned encoded chunk buffer so that:
 * - the first kept chunk is always a keyframe (required to decode the rest), and
 * - the kept range covers at least `windowUs` microseconds ending at the newest chunk.
 *
 * The newest chunk is always kept. Returns a new array; input is not mutated.
 */
export function trimChunksToWindow<T extends EncodedChunkLike>(chunks: T[], windowUs: number): T[] {
  if (chunks.length === 0) {
    return chunks;
  }
  const cutoff = chunks[chunks.length - 1]!.timestamp - windowUs;

  // Find the latest keyframe at or before the cutoff. Everything before it can be dropped
  // while keeping >= windowUs of decodable video.
  let start = 0;
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i]!.type === "key" && chunks[i]!.timestamp <= cutoff) {
      start = i;
    }
  }
  return chunks.slice(start);
}

/** Splits buffered chunks at a keyframe so saved video always starts on a keyframe. */
export function alignToFirstKeyframe<T extends EncodedChunkLike>(chunks: T[]): T[] {
  const firstKey = chunks.findIndex((chunk) => chunk.type === "key");
  return firstKey < 0 ? [] : chunks.slice(firstKey);
}
