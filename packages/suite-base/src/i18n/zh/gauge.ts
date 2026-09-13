// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

import { TypeOptions } from "i18next";

export const gauge: TypeOptions["resources"]["gauge"] = {
  messagePath: {
    label: "消息路径",
  },
  minValue: {
    label: "最小值",
  },
  maxValue: {
    label: "最大值",
  },
  colorMode: {
    label: "颜色模式",
    options: {
      colorMap: "颜色映射",
      gradient: "渐变",
    },
  },
  colorMap: {
    label: "颜色模式",
    options: {
      rainbow: "彩虹",
      redYellowGreen: "红到绿",
      turbo: "Turbo",
    },
  },
  reverse: {
    label: "反转",
  },
};
