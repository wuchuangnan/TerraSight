// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { TypeOptions } from "i18next";

export const threeDee: TypeOptions["resources"]["threeDee"] = {
  // Common
  color: "颜色",
  colorMode: "颜色模式",
  frame: "参考系",
  lineWidth: "线宽",
  position: "位置",
  reset: "重置",
  rotation: "旋转",
  scale: "缩放",
  gradient: "渐变",
  type: "类型",
  topic: "话题",

  // Frame
  age: "陈旧度",
  axisScale: "轴比例",
  displayFrame: "展示参考系",
  displayFrameHelp: "相机所处的坐标系。相机的位置和方向将相对于该坐标系的原点。",
  editable: "可编辑",
  enablePreloading: "启用预加载",
  enablePreloadingTooltip: "请注意，开启预加载可能会影响性能。",
  maxPreloadMessages: "最大预加载消息数",
  maxPreloadMessagesTooltip:
    "启用预加载时保留在内存中的变换消息最大数量。数值越大可保留的历史越多，但占用的内存也越多。",
  clearPreloadBuffer: "清空预加载缓冲",
  transformPreloadAlert: "检测到变换话题",
  transformPreloadAlertTip:
    "建议开启预加载（3D/Image 面板 -> 变换 -> 设置），以准确可视化变换话题。注意：这可能会影响性能。",
  fixed: "固定",
  followMode: "跟踪模式",
  followModeHelp: "更改回放期间相机的行为，是否跟踪显示坐标系。",
  frameNotFound: "未找到参考系 {{frameId}}",
  hideAll: "隐藏全部",
  historySize: "历史长度",
  labels: "标签",
  labelSize: "标签大小",
  lineColor: "线颜色",
  noCoordinateFramesFound: "未找到坐标系",
  parent: "父级",
  pose: "姿态",
  rotationOffset: "旋转偏移",
  settings: "设置",
  showAll: "显示全部",
  transforms: "变换",
  translation: "平移",
  translationOffset: "平移偏移",

  // Scene
  background: "背景",
  debugPicking: "调试拾取",
  ignoreColladaUpAxis: "忽略 COLLADA 的 <up_axis>",
  ignoreColladaUpAxisHelp: "通过忽略 COLLADA 文件中的 <up_axis> 标记，匹配 rviz 的行为",
  labelScale: "标签比例",
  labelScaleHelp: "应用于所有标签的比例因子",
  meshUpAxis: "网格上轴",
  meshUpAxisHelp: "加载缺少方向信息的网格（STL 和 OBJ）时使用的“上”方向",
  renderStats: "渲染统计",
  scene: "场景",
  takeEffectAfterReboot: "此设置需要重新启动以生效",
  YUp: "Y-up",
  ZUp: "Z-up",

  // Lighting
  mainLightMode: "主光源",
  mainLightModeHelp:
    "“固定”使用世界空间的方向光。“头灯”将光源附着到相机上，使场景始终从观察者的视角被照亮（类似 RViz）。",
  mainLightFixed: "固定（场景）",
  mainLightHeadlight: "头灯（相机）",
  directionalLightIntensity: "方向光强度",
  hemisphereLightIntensity: "半球光强度",

  // Camera
  distance: "距离",
  far: "远面",
  fovy: "Y 轴视野",
  near: "近面",
  perspective: "透视",
  phi: "方向角",
  planarProjectionFactor: "平面投影因子",
  syncCamera: "同步相机",
  syncCameraHelp: "将相机与其他启用此设置的面板同步。",
  target: "目标",
  theta: "极角",
  view: "视图",

  // Topics
  topics: "话题",

  // Custom layers
  addGrid: "添加网格",
  addURDF: "添加 URDF",
  customLayers: "自定义图层",
  delete: "删除",
  divisions: "划分",
  grid: "网格",
  size: "大小",

  // Image annotations
  imageAnnotations: "图像注释",
  resetView: "重置视图",

  // Images
  cameraInfo: "相机信息",

  // Occupancy Grids
  colorModeCustom: "自定义",
  colorModeRaw: "原始",
  colorModeRvizCostmap: "代价地图",
  colorModeRvizMap: "地图",
  frameLock: "锁定参考系",
  invalidColor: "无效值颜色",
  maxColor: "最大值颜色",
  minColor: "最小值颜色",
  unknownColor: "未知值颜色",

  // Point Extension Utils
  decayTime: "衰减时间",
  decayTimeDefaultZeroSeconds: "0 秒",
  pointShape: "点形状",
  pointShapeCircle: "圆形",
  pointShapeSquare: "方形",
  pointSize: "点大小",

  // Color Mode
  colorBy: "颜色映射值",
  colorModeBgraPacked: "BGRA（堆积）",
  colorModeBgrPacked: "BGR（堆积）",
  colorModeColorMap: "色板",
  colorModeFlat: "单色",
  colorModeRgbaSeparateFields: "RGBA（独立字段）",
  ColorFieldComputedDistance: "距离（自动）",
  flatColor: "单色",
  opacity: "透明度",
  valueMax: "最大值",
  valueMin: "最小值",

  // Markers
  selectionVariable: "选择变量",
  selectionVariableHelp: "选择标记时，该全局变量将被设置为标记 ID",
  showOutline: "显示轮廓",

  // Poses
  covariance: "协方差",
  covarianceColor: "协方差颜色",
  poseDisplayTypeArrow: "箭头",
  poseDisplayTypeAxis: "轴",
  poseDisplayTypeLine: "线条",

  // Publish
  publish: "发布",
  publishTopicHelp: "要发布到的话题",
  publishTypeHelp: "在场景中点击时要发布的消息类型",
  publishTypePoint: "点 (geometry_msgs/Point)",
  publishTypePose: "姿态 (geometry_msgs/PoseStamped)",
  publishTypePoseEstimate: "姿态估计 (geometry_msgs/PoseWithCovarianceStamped)",
  thetaDeviation: "Theta 偏差",
  thetaDeviationHelp: "随姿态估计值一起发布的 Theta 标准偏差",
  xDeviation: "X 偏差",
  xDeviationHelp: "随姿态估计值一起发布的 X 标准偏差",
  yDeviation: "Y 偏差",
  yDeviationHelp: "随姿态估计值一起发布的 Y 标准偏差",

  // HUD Items and empty states
  noImageTopicsAvailable: "没有可用的图像话题。",
  imageTopicDNE: "图像话题不存在。",
  calibrationTopicDNE: "标定话题不存在。",
  imageAndCalibrationDNE: "图像和标定话题不存在。",
  waitingForCalibrationAndImages: "正在等待消息……",
  waitingForCalibration: "正在等待标定消息……",
  waitingForImages: "正在等待图像消息……",
  waitingForSyncAnnotations: "正在等待同步的注释……",
};
