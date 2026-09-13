// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { TypeOptions } from "i18next";

// 面板级界面的文案：快捷操作、错误边界和面板日志
export const panel: TypeOptions["resources"]["panel"] = {
  groupInTab: "组合到选项卡",
  createTabs: "创建选项卡",
  splitDown: "向下拆分",
  splitRight: "向右拆分",
  remove: "移除",

  errorTitle: "此面板遇到了意外错误",
  errorIntro: "此面板出现问题。",
  dismissThisError: "忽略此错误",
  errorOutro: "以继续使用该面板。如果问题仍然存在，请尝试重置面板。",
  dismiss: "忽略",
  resetPanel: "重置面板",
  resetPanelTooltip: "将面板设置恢复为默认值",
  removePanel: "移除面板",
  removePanelTooltip: "从布局中移除此面板",

  logsCount: "日志 ({{count}})",
  dragToResize: "拖动以调整日志面板大小",
  clearLogs: "清空日志",
  closeLogs: "关闭日志",
  noLogsYet: "暂无日志",
  noLogsDescription: "错误和日志消息将显示在这里。",
};
