// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

import { DeleteSweep } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";
import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useStylesPanelLogs } from "@lichtblick/suite-base/components/PanelLogs.style";
import { PanelLogsProps } from "@lichtblick/suite-base/components/types";
import { MAX_HEIGHT, MIN_HEIGHT } from "@lichtblick/suite-base/constants/panelLogs";

export default function PanelLogs({
  logs,
  onClose,
  onClear,
  initialHeight = MAX_HEIGHT,
  onHeightChange,
}: PanelLogsProps): React.ReactElement {
  const { t } = useTranslation("panel");
  const { classes } = useStylesPanelLogs();
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(ReactNull);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startYRef.current = e.clientY;
      startHeightRef.current = height;
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    },
    [height],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeightRef.current + deltaY));
      setHeight(newHeight);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    // Save the height when dragging ends
    if (onHeightChange) {
      onHeightChange(height);
    }
  }, [height, onHeightChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={classes.root}
      style={{ height: `${height}px`, maxHeight: "none" }}
    >
      <div
        className={classes.resizeHandle}
        onMouseDown={handleMouseDown}
        title={t("dragToResize")}
      >
        <DragIndicatorIcon className={classes.resizeIcon} />
      </div>

      <div className={classes.header}>
        <Typography variant="subtitle2">{t("logsCount", { count: logs.length })}</Typography>
        <div>
          <IconButton
            size="small"
            onClick={onClear}
            title={t("clearLogs")}
            disabled={logs.length === 0}
          >
            <DeleteSweep fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose} title={t("closeLogs")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <div className={classes.listContainer}>
        <List dense>
          {logs.length === 0 ? (
            <ListItem>
              <ListItemText
                primary={t("noLogsYet")}
                secondary={t("noLogsDescription")}
              />
            </ListItem>
          ) : (
            logs.map((log, idx) => (
              <ListItem key={idx} alignItems="flex-start" className={classes.listItem}>
                <ListItemText
                  primary={`[${log.error ? "ERROR" : "INFO"}] ${log.message}`}
                  secondary={
                    <>
                      <Typography variant="caption" display="block">
                        {log.timestamp}
                      </Typography>
                      {log.error && (
                        <Typography
                          variant="caption"
                          color="error"
                          component="pre"
                          style={{ fontSize: "0.7em", marginTop: 4 }}
                        >
                          {log.error.stack ?? log.error.message}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </div>
    </div>
  );
}
