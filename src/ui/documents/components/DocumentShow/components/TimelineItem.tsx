import * as React from "react";
import { Box, Typography, Chip } from "@mui/material";

export interface TimelineItemProps {
  title: string;
  subtitle: string;
  date: string;
  status: "completed" | "current" | "pending";
  isLast?: boolean;
  icon: React.ReactNode;
  selected?: boolean;
  docNumber?: string;
  key?: React.Key;
}

export function TimelineItem({
  title,
  subtitle,
  date,
  status,
  isLast,
  icon,
  selected,
  docNumber,
}: TimelineItemProps) {
  const getColors = () => {
    if (status === "completed") return { dot: "#10B981", line: "#10B981", bg: "#DCFCE7" };
    if (status === "current") return { dot: "#6366F1", line: "#E5E7EB", bg: "#EEF2FF" };
    return { dot: "#D1D5DB", line: "#E5E7EB", bg: "#F3F4F6" };
  };

  const colors = getColors();

  return (
    <Box sx={{ display: "flex", gap: 2.5, position: "relative" }}>
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            left: 17,
            top: 34,
            width: 2,
            height: "calc(100% - 24px)",
            bgcolor: colors.line,
            zIndex: 0,
            opacity: 0.6,
          }}
        />
      )}
      <Box sx={{ position: "relative", zIndex: 1, pt: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "12px",
            bgcolor: colors.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.dot,
            boxShadow: status === "current" ? "0 4px 12px rgba(99,102,241,0.2)" : "none",
            border: status === "current" ? "2px solid #6366F1" : "none",
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          pb: 3,
          p: 2,
          borderRadius: "12px",
          bgcolor: selected ? "white" : "transparent",
          border: selected ? "1px solid #E5E7EB" : "1px solid transparent",
          boxShadow: selected ? "0 4px 12px rgba(0,0,0,0.03)" : "none",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: selected ? "white" : "rgba(255,255,255,0.4)",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: status === "pending" ? "#9CA3AF" : "#111827" }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600 }}>
            {date}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "0.72rem", color: "#6B7280", mb: 1, fontWeight: 500 }}>
          {subtitle}
        </Typography>
        {docNumber && (
          <Chip
            label={docNumber}
            size="small"
            variant="outlined"
            sx={{
              height: 18,
              fontSize: "0.6rem",
              fontWeight: 700,
              fontFamily: "monospace",
              bgcolor: "white",
              borderColor: "#E5E7EB",
              color: "#475569",
            }}
          />
        )}
      </Box>
    </Box>
  );
}
