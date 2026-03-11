import * as React from "react";
import { Card, Box, Typography } from "@mui/material";
import { Clock } from "lucide-react";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { formatEuropeanDate } from "../utils/formatters";

interface DocumentTimeInfoProps {
  document: DocumentEntity;
}

export function DocumentTimeInfo({ document }: DocumentTimeInfoProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        overflow: "hidden"
      }}
    >
      <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #F3F4F6', display: "flex", alignItems: "center", gap: 1, bgcolor: '#F9FAFB' }}>
        <Clock size={14} color="#6B7280" />
        <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Tiempos de Cobro
        </Typography>
      </Box>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "0.65rem", color: "#9CA3AF", fontWeight: 600, mb: 0.5 }}>VENCIMIENTO</Typography>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: "#DC2626" }}>
            {formatEuropeanDate(document.due_date)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: "0.65rem", color: "#9CA3AF", fontWeight: 600, mb: 0.5 }}>EMISIÓN</Typography>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
            {formatEuropeanDate(document.issue_date)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
