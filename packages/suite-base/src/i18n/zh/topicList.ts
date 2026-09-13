// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { TypeOptions } from "i18next";

export const topicList: TypeOptions["resources"]["topicList"] = {
  anErrorOccurred: "发生错误",
  clearFilter: "清除筛选",
  copyMessagePath: "复制消息路径",
  copyMessagePaths: "复制所选消息路径",
  copySchemaName: "复制 schema 名称",
  copyTopicName: "复制话题名称",
  copyTopicNames: "复制所选话题名称",
  noDataSourceSelected: "未选择数据源",
  noTopicsAvailable: "暂无可用话题。 ",
  noTopicsOrDatatypesMatching: "没有匹配的话题或数据类型",
  searchBarPlaceholder: "按话题或 schema 名称筛选……",
  waitingForConnection: "等待连接",
  waitingForData: "等待数据……",
};
