// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { TypeOptions } from "i18next";

export const stateTransitions: TypeOptions["resources"]["stateTransitions"] = {
  addSeriesButton: "点击添加数据系列",
  labels: {
    addSeries: "添加数据系列",
    axisLabel: "轴标签",
    deleteSeries: "删除数据系列",
    general: "通用",
    helpGeneral: "为每个状态转换消息显示一个点",
    label: "标签",
    messagePath: "消息路径",
    series: "数据系列",
    showPoints: "显示点",
    sync: "与其他图表同步",
    timestamp: "时间戳",
    timestampHeaderStamp: "头时间戳",
    timestampReceiveTime: "接收时间",
  },
  max: "最大",
  maxXError: "X 最大值必须大于 X 最小值。",
  min: "最小",
  pathErrorMessage: "该路径解析出多个值",
  secondsRange: "范围（秒）",
  xAxis: "X 轴",
};
