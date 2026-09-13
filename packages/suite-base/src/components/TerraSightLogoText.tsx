// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { SvgIcon, SvgIconProps } from "@mui/material";

// TerraSight wordmark: TerraSight
export default function TerraSightLogoText(props: SvgIconProps): React.JSX.Element {
  return (
    <SvgIcon viewBox="0 0 1200 204" {...props}>
      <title>TerraSight</title>
      <text
        x="0"
        y="164"
        fontSize="164"
        fontWeight="600"
        fill="currentColor"
        style={{ fontFamily: "inherit" }}
      >
        TerraSight
      </text>
    </SvgIcon>
  );
}
