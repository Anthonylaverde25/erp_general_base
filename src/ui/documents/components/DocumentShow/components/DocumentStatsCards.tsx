import * as React from "react";
import { Box, Card, Typography } from "@mui/material";
import { FileText, TrendingUp, Clock } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

interface DocumentStatsCardsProps {
  total: number;
  totalPaid: number;
  balance: number;
  isCreditNote?: boolean;
}

export function DocumentStatsCards({ total, totalPaid, balance, isCreditNote = false }: DocumentStatsCardsProps) {
  const stats = [
    { label: "Total Documento", value: formatCurrency(isCreditNote ? -total : total), color: "#111827", subtitle: "Monto bruto", icon: <FileText size={14} /> },
    { label: "Total Cobrado", value: formatCurrency(isCreditNote ? -totalPaid : totalPaid), color: "#10B981", subtitle: "Pagos recibidos", icon: <TrendingUp size={14} /> },
    { label: "Pendiente", value: formatCurrency(isCreditNote ? -balance : balance), color: "#DC2626", subtitle: "Saldo por cobrar", icon: <Clock size={14} /> },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <Card
          key={stat.label}
          elevation={0}
          sx={{
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Card Header */}
          <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F9FAFB' }}>
            <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {stat.label}
            </Typography>
            <Box sx={{ color: stat.color, opacity: 0.8 }}>
              {stat.icon}
            </Box>
          </Box>

          {/* Card Body */}
          <Box sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 900, color: stat.color }}>
              {stat.value}
            </Typography>
          </Box>

          {/* Card Footer */}
          <Box sx={{ px: 2, py: 1, bgcolor: '#FAFBFC', borderTop: '1px solid #F3F4F6' }}>
            <Typography sx={{ fontSize: "0.65rem", color: "#9CA3AF", fontWeight: 600 }}>
              {stat.subtitle}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
