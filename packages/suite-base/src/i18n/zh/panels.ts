// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { TypeOptions } from "i18next";

export const panels: TypeOptions["resources"]["panels"] = {
  "3D": "3D",
  "3DPanelDescription": "在 3D 场景中显示标记、相机图像、网格、URDF 等内容。",
  callService: "调用服务",
  callServiceDescription: "调用服务并查看服务调用结果。",
  dataSourceInfo: "数据源信息",
  dataSourceInfoDescription: "查看当前数据源的话题和时间戳等详细信息。",
  gauge: "仪表",
  gaugeDescription: "基于连续值显示彩色仪表。",
  image: "图像",
  imageDescription: "显示带注释的图像。",
  indicator: "指示器",
  indicatorDescription: "基于阈值显示彩色和/或文本指示器。",
  log: "日志",
  logDescription: "按节点和严重程度级别显示日志。",
  map: "地图",
  mapDescription: "在地图上显示点。",
  parameters: "参数",
  parametersDescription: "读取和设置数据源的参数。",
  plot: "图表",
  plotDescription: "绘制随时间或其他值变化的数值。",
  pieChart: "饼图",
  pieChartDescription: "基于连续值显示饼图。",
  publish: "发布",
  publishDescription: "向数据源发布消息（仅限实时连接）。",
  rawMessages: "原始消息",
  rawMessagesDescription: "检查话题消息。",
  rawMessagesVirtual: "原始消息（虚拟列表）",
  rawMessagesVirtualDescription: "使用虚拟列表检查话题消息，适用于大数据量话题。",
  ROSDiagnosticsDetail: "诊断 – 详细信息（ROS）",
  ROSDiagnosticsDetailDescription: "显示特定 hardware_id 的 ROS DiagnosticArray 消息。",
  ROSDiagnosticSummary: "诊断 – 概要（ROS）",
  ROSDiagnosticSummaryDescription: "显示所有 ROS DiagnosticArray 消息的摘要。",
  stateTransitions: "状态转换",
  stateTransitionsDescription: "跟踪值随时间变化的情况。",
  studioPlaybackPerformance: "Studio - 回放性能",
  studioPlaybackPerformanceDescription: "显示回放和数据流性能统计信息。",
  tab: "选项卡",
  tabDescription: "将面板分组在选项卡界面中。",
  table: "表格",
  tableDescription: "以表格形式显示话题消息。",
  teleop: "远程操纵",
  teleopDescription: "通过实时连接远程操纵机器人。",
  topicGraph: "话题图",
  topicGraphDescription: "显示活动节点、话题和服务的图形。",
  userScripts: "用户脚本",
  userScriptsDescription: "使用 TypeScript 编写自定义数据转换。以前称为 Node Playground。",
  variableSlider: "变量滑块",
  variableSliderDescription: "更新布局的数值变量值。",
};
