// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Button, Link } from "@mui/material";
import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import ErrorDisplay from "@lichtblick/suite-base/components/ErrorDisplay";
import Stack from "@lichtblick/suite-base/components/Stack";
import {
  PanelErrorBoundaryProps,
  PanelErrorBoundaryState,
} from "@lichtblick/suite-base/components/types";
import { reportError } from "@lichtblick/suite-base/reportError";
import { AppError } from "@lichtblick/suite-base/util/errors";

type PanelErrorViewProps = {
  error: Error;
  errorInfo?: ErrorInfo;
  showErrorDetails?: boolean;
  hideErrorSourceLocations?: boolean;
  onDismiss: () => void;
  onResetPanel: () => void;
  onRemovePanel: () => void;
};

// Function component so the error view can use the translation hook
function PanelErrorView(props: PanelErrorViewProps): ReactNode {
  const { t } = useTranslation("panel");
  return (
    <ErrorDisplay
      title={t("errorTitle")}
      error={props.error}
      errorInfo={props.errorInfo}
      showErrorDetails={props.showErrorDetails}
      hideErrorSourceLocations={props.hideErrorSourceLocations}
      content={
        <p>
          {t("errorIntro")}{" "}
          <Link color="inherit" onClick={props.onDismiss}>
            {t("dismissThisError")}
          </Link>{" "}
          {t("errorOutro")}
        </p>
      }
      actions={
        <Stack direction="row-reverse" gap={1}>
          <Button variant="outlined" color="secondary" onClick={props.onDismiss}>
            {t("dismiss")}
          </Button>
          <Button
            variant="outlined"
            title={t("resetPanelTooltip")}
            color="error"
            onClick={() => {
              props.onDismiss();
              props.onResetPanel();
            }}
          >
            {t("resetPanel")}
          </Button>
          <Button variant="text" title={t("removePanelTooltip")} color="error" onClick={props.onRemovePanel}>
            {t("removePanel")}
          </Button>
        </Stack>
      }
    />
  );
}

export default class PanelErrorBoundary extends Component<
  PropsWithChildren<PanelErrorBoundaryProps>,
  PanelErrorBoundaryState
> {
  public override state: PanelErrorBoundaryState = {
    currentError: undefined,
  };

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportError(new AppError(error, errorInfo));
    this.setState({ currentError: { error, errorInfo } });

    if (this.props.onLogError) {
      this.props.onLogError(`Panel render error: ${error.message}`, error);
    }
  }

  public override render(): ReactNode {
    if (this.state.currentError) {
      return (
        <PanelErrorView
          error={this.state.currentError.error}
          errorInfo={this.state.currentError.errorInfo}
          showErrorDetails={this.props.showErrorDetails}
          hideErrorSourceLocations={this.props.hideErrorSourceLocations}
          onDismiss={() => {
            this.setState({ currentError: undefined });
          }}
          onResetPanel={this.props.onResetPanel}
          onRemovePanel={this.props.onRemovePanel}
        />
      );
    }

    return this.props.children;
  }
}
