// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { SvgIcon, SvgIconProps } from "@mui/material";

// TerraSight brand mark: side view of a wheel loader (装载机)
export function TerraSightLogo(props: SvgIconProps): React.JSX.Element {
  return (
    <SvgIcon viewBox="0 0 512 512" {...props}>
      <title>TerraSight</title>
      <mask id="terrasight-loader-mask">
        <rect width="512" height="512" fill="black" />
        <g fill="white">
          <polygon points="250,243.75 425,285 412.5,337.5 243.75,295" />
          <polygon points="375,266.25 475,287.5 466.25,391.25 381.25,370" />
          <rect x="63.75" y="228.75" width="256.25" height="91.25" rx="18.75" />
          <rect x="222.5" y="166.25" width="105" height="85" rx="13.75" />
          <circle cx="131.25" cy="348.75" r="41.875" />
          <circle cx="326.25" cy="348.75" r="41.875" />
        </g>
        <rect x="237.5" y="182.5" width="75" height="46.25" rx="10" fill="black" />
        <circle cx="131.25" cy="348.75" r="18.75" fill="black" />
        <circle cx="326.25" cy="348.75" r="18.75" fill="black" />
      </mask>
      <rect width="512" height="512" fill="currentColor" mask="url(#terrasight-loader-mask)" />
    </SvgIcon>
  );
}
