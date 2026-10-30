// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Record24Regular, RecordStop24Regular } from "@fluentui/react-icons";
import { Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";

import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import Stack from "@lichtblick/suite-base/components/Stack";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks";
import { useScreenRecordingHost } from "@lichtblick/suite-base/services/screenRecording/ScreenRecordingHost";
import {
  ScreenRecordingSettings,
  useScreenRecording,
} from "@lichtblick/suite-base/services/screenRecording/screenRecordingManager";

import { AppBarIconButton } from "./AppBarIconButton";

const useStyles = makeStyles()((theme) => ({
  recordingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    color: theme.palette.error.main,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.error.main,
    animation: "pulse 1.5s ease-in-out infinite",
    "@keyframes pulse": {
      "0%, 100%": { opacity: 1 },
      "50%": { opacity: 0.3 },
    },
  },
  recordIcon: {
    color: theme.palette.error.main,
  },
}));

function recordingFileName(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `recording-${stamp}.mp4`;
}

function formatElapsed(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function RecordingButton(): React.JSX.Element {
  const { classes } = useStyles();
  const { t } = useTranslation("recording");
  const { enqueueSnackbar } = useSnackbar();
  const host = useScreenRecordingHost();
  const { state, elapsedMs, start, stopAndSave } = useScreenRecording();

  const [loopSeconds = 20] = useAppConfigurationValue<number>(AppSetting.RECORDING_LOOP_DURATION);
  const [trailingSeconds = 10] = useAppConfigurationValue<number>(
    AppSetting.RECORDING_TRAILING_DURATION,
  );
  const [frameRate = 15] = useAppConfigurationValue<number>(AppSetting.RECORDING_FRAME_RATE);

  const onStart = useCallback(async () => {
    const settings: ScreenRecordingSettings = {
      loopSeconds: Math.max(1, loopSeconds),
      trailingSeconds: Math.max(0, trailingSeconds),
      frameRate: Math.min(60, Math.max(1, frameRate)),
    };
    try {
      const stream = await host.captureAppWindowStream(settings.frameRate);
      try {
        await start(settings, stream);
      } catch (error) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        throw error;
      }
    } catch (error) {
      enqueueSnackbar(`${t("recordingFailed")}: ${(error as Error).message}`, {
        variant: "error",
      });
    }
  }, [host, loopSeconds, trailingSeconds, frameRate, start, enqueueSnackbar, t]);

  const onStop = useCallback(async () => {
    try {
      const blob = await stopAndSave();
      const data = new Uint8Array(await blob.arrayBuffer());
      const savedPath = await host.saveRecording(recordingFileName(), data);
      if (savedPath != undefined) {
        enqueueSnackbar(t("recordingSavedTo", { path: savedPath }), {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar(`${t("recordingFailed")}: ${(error as Error).message}`, {
        variant: "error",
      });
    }
  }, [stopAndSave, host, enqueueSnackbar, t]);

  if (state === "idle") {
    return (
      <AppBarIconButton
        title={t("startRecording")}
        aria-label={t("startRecording")}
        onClick={() => void onStart()}
        data-testid="recording-button"
      >
        <Record24Regular className={classes.recordIcon} />
      </AppBarIconButton>
    );
  }

  return (
    <Stack direction="row" alignItems="center" paddingRight={0.5}>
      <div className={classes.recordingIndicator}>
        <div className={classes.recordingDot} />
        <Typography variant="caption" color="inherit" fontFamily="monospace">
          {formatElapsed(elapsedMs)}
        </Typography>
      </div>
      <AppBarIconButton
        title={state === "stopping" ? t("savingRecording") : t("stopRecording")}
        aria-label={t("stopRecording")}
        disabled={state === "stopping"}
        onClick={() => void onStop()}
        data-testid="stop-recording-button"
      >
        <RecordStop24Regular className={classes.recordIcon} />
      </AppBarIconButton>
    </Stack>
  );
}
