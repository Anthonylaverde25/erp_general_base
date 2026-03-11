import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { CreditCard, Search, Filter, Download, RefreshCw, TrendingUp } from "lucide-react";
import { useIndexPayments } from "@/features/payments/hooks/useIndexPayments";
import { formatCurrency, formatEuropeanDate } from "../utils/formatters";

interface TransactionHistoryProps {
  documentId: string | number;
  totalPaid: number;
}

interface PaymentRow {
  id: string;
  date: string;
  ref: string;
  method: string;
  amount: number;
  status: "confirmed" | "pending" | "reversed";
}

export function TransactionHistory({ documentId, totalPaid }: TransactionHistoryProps) {
  const [quickFilter, setQuickFilter] = React.useState("");
  const { payments, isLoading } = useIndexPayments({ documentId: documentId.toString() });

  const rowData: PaymentRow[] = payments.map((p) => ({
    id: String(p.id),
    date: p.payment_date,
    ref: p.reference || "N/A",
    method: p.payment_method_name || "Varios",
    amount: p.amount,
    status: "confirmed" as const,
  }));

  const filteredRows = rowData.filter(row =>
    row.ref.toLowerCase().includes(quickFilter.toLowerCase()) ||
    row.method.toLowerCase().includes(quickFilter.toLowerCase())
  );

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #E5E7EB",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CreditCard size={15} color="#6366F1" />
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>
            Historial de Transacciones
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Buscar..."
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={13} color="#9CA3AF" />
                </InputAdornment>
              ),
              sx: {
                fontSize: "0.78rem",
                height: 32,
                borderRadius: "7px",
                bgcolor: "#F9FAFB",
                "& fieldset": { borderColor: "#E5E7EB" },
              },
            }}
            sx={{ width: 180 }}
          />

          <Tooltip title="Filtros avanzados">
            <span>
              <IconButton
                size="small"
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "7px",
                  p: 0.7,
                }}
              >
                <Filter size={14} color="#6B7280" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Exportar CSV">
            <span>
              <IconButton
                size="small"
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "7px",
                  p: 0.7,
                }}
              >
                <Download size={14} color="#6B7280" />
              </IconButton>
            </span>
          </Tooltip>

          <Button
            size="small"
            startIcon={<Download size={14} />}
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "none",
              height: 32,
              px: 1.6,
              borderRadius: "7px",
              border: "1px dashed #E5E7EB",
              color: "#374151",
              bgcolor: "#FFFFFF",
              "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" },
            }}
          >
            Exportar Excel
          </Button>

          <Button
            size="small"
            startIcon={<RefreshCw size={12} />}
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "none",
              height: 32,
              px: 1.5,
              borderRadius: "7px",
              bgcolor: "#6366F1",
              color: "white",
              "&:hover": { bgcolor: "#4F46E5" },
            }}
          >
            Nuevo pago
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: 360,
          borderRadius: 0,
          borderTop: "1px solid #E5E7EB"
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 1.8, px: 3, fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>FECHA</TableCell>
              <TableCell sx={{ py: 1.8, px: 3, fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>REFERENCIA</TableCell>
              <TableCell sx={{ py: 1.8, px: 3, fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>MÉTODO</TableCell>
              <TableCell align="right" sx={{ py: 1.8, px: 3, fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>IMPORTE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, fontSize: '12px', color: '#6B7280' }}>
                  Cargando historial de pagos...
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, fontSize: '12px', color: '#6B7280' }}>
                  No hay transacciones registradas.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:nth-of-type(even)': { bgcolor: '#F9FAFB' },
                    '&:hover': { bgcolor: '#EEF2FF' },
                    opacity: row.status === 'reversed' ? 0.5 : 1,
                    textDecoration: row.status === 'reversed' ? 'line-through' : 'none'
                  }}
                >
                  <TableCell sx={{ py: 2, px: 3, fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>{formatEuropeanDate(row.date)}</TableCell>
                  <TableCell sx={{ py: 2, px: 3, fontSize: '12px', color: '#111827', fontWeight: 500 }}>{row.ref}</TableCell>
                  <TableCell sx={{ py: 2, px: 3, fontSize: '12px', color: '#374151' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{
                        row.method === "Transferencia SEPA" ? "🏦" :
                          row.method === "Tarjeta" ? "💳" :
                            row.method === "Domiciliación" ? "🔄" :
                              row.method === "Ajuste" ? "⚙️" : "💶"
                      }</span>
                      {row.method}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2, px: 3, fontSize: '12px', fontWeight: 700, color: row.amount < 0 ? "#DC2626" : "#111827" }}>
                    {formatCurrency(row.amount)}
                  </TableCell>
                </TableRow>
              )))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 1,
          borderTop: "1px solid #E5E7EB",
          bgcolor: "white",
          fontSize: "0.72rem",
          color: "#475569",
        }}
      >
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700 }}>
          {rowData.length} filas totales
        </Typography>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderTop: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#FAFBFC",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10B981" }} />
            <Typography sx={{ fontSize: "0.7rem", color: "#6B7280" }}>
              {rowData.filter((r) => r.status === "confirmed").length} confirmados
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#F59E0B" }} />
            <Typography sx={{ fontSize: "0.7rem", color: "#6B7280" }}>
              {rowData.filter((r) => r.status === "pending").length} pendientes
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUp size={13} color="#6366F1" />
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#111827" }}>
            Total cobrado: {formatCurrency(totalPaid)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
