// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

import { TypeOptions } from "i18next";

export const httpErrors: TypeOptions["resources"]["httpErrors"] = {
  networkError: "网络连接错误。请检查你的连接。",
  badRequest: "请求无效。请检查输入后重试。",
  unauthorized: "你尚未通过身份验证。",
  forbidden: "你没有权限执行此操作。",
  notFound: "未找到请求的资源。",
  conflict: "资源已存在或已被修改。",
  internalServerError: "服务器错误。请稍后重试。",
  clientError: "请求错误。请检查输入后重试。",
  serverError: "服务器错误。请稍后重试。",
};
