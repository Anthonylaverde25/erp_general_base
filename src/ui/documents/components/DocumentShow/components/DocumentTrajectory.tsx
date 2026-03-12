import * as React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { FileText, CreditCard, Clock } from "lucide-react";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import { formatEuropeanDate } from "../utils/formatters";
import { TimelineItem } from "./TimelineItem";

interface DocumentTrajectoryProps {
  document: DocumentEntity;
}

export function DocumentTrajectory({ document }: DocumentTrajectoryProps) {
  return (
    <Box
      sx={{
        width: 396,
        borderRight: "1px solid #E5E7EB",
        p: 3,
        overflowY: "auto",
        display: { xs: "none", lg: "block" },
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 12px 24px rgba(15,23,42,0.05)",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#9CA3AF",
          mb: 0.8,
        }}
      >
        Estado del Proceso
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 4,
            bgcolor: "#6366F1",
            borderRadius: 2,
            boxShadow: "0 6px 14px rgba(99,102,241,0.35)",
          }}
        />
        <Chip
          label="Ciclo activo"
          size="small"
          sx={{
            height: 22,
            fontSize: "0.62rem",
            fontWeight: 800,
            letterSpacing: "0.03em",
            bgcolor: "#EEF2FF",
            color: "#4338CA",
            border: "1px solid #C7D2FE",
          }}
        />
      </Box>

      <Stack spacing={1.6}>
        {document.predecessors.map((parent) => (
          <TimelineItem
            key={parent.id}
            title={parent.document_type_name || "Documento Padre"}
            subtitle="Documento origen"
            date={formatEuropeanDate(parent.issue_date)}
            status="completed"
            icon={<FileText size={13} />}
            docNumber={parent.number_serie}
          />
        ))}

        <TimelineItem
          title={document.document_type_name || "Documento Actual"}
          subtitle="Documento en vista"
          date={formatEuropeanDate(document.issue_date)}
          status="current"
          icon={<CreditCard size={13} />}
          docNumber={document.number_serie || String(document.id)}
          selected
        />

        {document.successors.map((child, index) => (
          <TimelineItem
            key={child.id}
            title={child.document_type_name || "Documento Hijo"}
            subtitle="Documento generado"
            date={formatEuropeanDate(child.issue_date)}
            status="pending"
            isLast={index === document.successors.length - 1}
            icon={<Clock size={13} />}
            docNumber={child.number_serie}
          />
        ))}

        {(!document.successors || document.successors.length === 0) && (
          <TimelineItem
            title="Fin de Ciclo"
            subtitle="Documento final"
            date="—"
            status="pending"
            isLast
            icon={<Clock size={13} />}
            docNumber="—"
          />
        )}
      </Stack>
    </Box>
  );
}
