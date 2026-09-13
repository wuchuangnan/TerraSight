// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { TypeOptions } from "i18next";

// 布局侧边栏与布局操作菜单的文案
export const layouts: TypeOptions["resources"]["layouts"] = {
  layouts: "布局",
  createNewLayout: "新建布局",
  importLayout: "导入布局",
  importFromFile: "从文件导入…",
  offline: "离线",
  personal: "个人",
  personalEmptyText: "新建一个布局，开始使用吧！",
  organization: "组织",
  organizationEmptyText: "你的组织还没有共享布局。共享一个布局即可与他人协作。",
  shareCopyTitle: "将副本共享给组织",
  shareCopySubText: "共享的布局可被组织中的其他成员使用和修改。",
  layoutName: "布局名称",
  unnamedLayout: "未命名布局 {{date}} {{time}}",
  nameCopy: "{{name}} 副本",
  errorProcessingLayouts: "处理布局时出错：{{message}}",

  rename: "重命名",
  duplicate: "创建副本",
  makePersonalCopy: "创建个人副本",
  shareWithTeam: "共享给团队…",
  export: "导出…",
  saveChanges: "保存更改",
  revert: "还原",
  delete: "删除",
  unsavedChanges: "此布局有未保存的更改",
  unsavedChangesMulti: "这些布局有未保存的更改",
  deletedBySomeoneElse: "其他人已删除此布局",
  orgNoAccessWarning: "组织成员将无法再访问此布局。",
  deleteCannotBeUndone: "此操作无法撤销。",
  deleteTitle: "删除“{{name}}”？",
  deleteTitleMulti: "删除所选布局？",
  revertTitle: "还原“{{name}}”？",
  revertTitleMulti: "还原布局",
  revertPrompt: "你的更改将被永久丢弃，此操作无法撤销。",
  discardChanges: "放弃更改",
};
