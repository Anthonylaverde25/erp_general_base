import * as React from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  Divider,
  Chip,
  Stack,
  Button,
  Tooltip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  X,
  CreditCard,
  FileText,
  Clock,
  User,
  MoreVertical,
  Search,
  Download,
  Filter,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Printer,
  StickyNote,
} from "lucide-react";
import { TransitionProps } from "@mui/material/transitions";
import { DocumentEntity } from "@/domain/entities/documents/DocumentEntity";
import "../../pages/DocumentCreatePage.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Note {
  id: string;
  title: string;
  text: string;
  author: string;
  date: string;
}

interface PaymentRow {
  id: string;
  date: string;
  ref: string;
  method: string;
  amount: number;
  status: "confirmed" | "pending" | "reversed";
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

/* ── Timeline ── */
function TimelineItem({
  title,
  subtitle,
  date,
  status,
  isLast,
  icon,
  selected,
  docNumber,
}: {
  title: string;
  subtitle: string;
  date: string;
  status: "completed" | "current" | "pending";
  isLast?: boolean;
  icon: React.ReactNode;
  selected?: boolean;
  docNumber?: string;
}) {
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

interface DocumentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  document: DocumentEntity;
}

export default function DocumentDetailsModal({
  open,
  onClose,
  document,
}: DocumentDetailsModalProps) {
  const [quickFilter, setQuickFilter] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState<PaymentRow[]>([]);

  const totalPaid = document.total_paid || 0;
  const total = document.total || 0;
  const balance = total - totalPaid;

  const rowData: PaymentRow[] = [
    { id: "1", date: "01/03/2026", ref: "TR-98231", method: "Transferencia SEPA", amount: 1500.0, status: "confirmed" },
    { id: "2", date: "05/03/2026", ref: "CC-11209", method: "Tarjeta", amount: 450.5, status: "confirmed" },
    { id: "3", date: "08/03/2026", ref: "DD-00342", method: "Domiciliación", amount: 200.0, status: "pending" },
    { id: "4", date: "06/03/2026", ref: "REV-11209", method: "Ajuste", amount: -450.5, status: "reversed" },
  ];

  const notes: Note[] = [
    { id: "n1", title: "Llamada de cliente", text: "Solicitó cambio en fecha de entrega para el ítem principal.", author: "Juan P.", date: "03/03/2026" },
    { id: "n2", title: "Pago parcial", text: "Confirmar si el abono de 05/03 cubre envío express.", author: "Soporte", date: "08/03/2026" },
  ];

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{ sx: { bgcolor: "#F9FAFB" } }}
    >
      <AppBar
        elevation={0}
        sx={{
          position: "fixed",
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid #E5E7EB",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: "56px !important",
            px: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton edge="start" size="small" onClick={onClose}>
              <X size={18} />
            </IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 20, my: "auto" }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {document.document_type_name} {document.number_serie || "(Borrador)"}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "#6B7280" }}>
                #{document.id} · {document.partner_name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.2, color: "#6B7280" }}>
                {document.partner_email && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: "0.66rem" }}>
                    <Mail size={12} />
                    <span>{document.partner_email}</span>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Chip
              label={document.status?.name}
              sx={{
                height: 22,
                fontSize: "0.6rem",
                fontWeight: 800,
                textTransform: "uppercase",
                bgcolor: "#F3F4F6",
                color: "#374151",
                borderRadius: "5px",
                border: "1px solid #E5E7EB",
              }}
            />
            <Tooltip title="Más opciones">
              <IconButton size="small">
                <MoreVertical size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          mt: "56px",
          display: "flex",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: 360,
            borderRight: "1px solid #E5E7EB",
            p: 3,
            overflowY: "auto",
            display: { xs: "none", lg: "block" },
            background: "linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)",
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
            <TimelineItem
              title="Presupuesto"
              subtitle="Oferta base"
              date="01 Mar, 10:45"
              status="completed"
              icon={<FileText size={13} />}
              docNumber={document.number_serie || String(document.id)}
            />
            <TimelineItem
              title="Confirmación"
              subtitle="Aprobación comercial"
              date="05 Mar, 15:20"
              status="completed"
              icon={<CheckCircle size={13} />}
              docNumber={document.number_serie || String(document.id)}
            />
            <TimelineItem
              title="Entrega / Albarán"
              subtitle="Logística"
              date="08 Mar, 09:12"
              status="completed"
              icon={<User size={13} />}
              docNumber={document.number_serie || String(document.id)}
            />
            <TimelineItem
              title="Facturación"
              subtitle="Gestión administrativa"
              date="Hoy, 07:33"
              status="current"
              icon={<CreditCard size={13} />}
              docNumber={document.number_serie || String(document.id)}
              selected
            />
            <TimelineItem
              title="Fin de Ciclo"
              subtitle="Cierre contable"
              date="25 Mar, 2026"
              status="pending"
              isLast
              icon={<Clock size={13} />}
              docNumber={document.number_serie || String(document.id)}
            />
          </Stack>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>
          <Stack spacing={4} sx={{ maxWidth: 1000, mx: "auto" }}>
            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                p: 3,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 4,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {[
                { label: "Total Documento", value: formatCurrency(total), color: "#111827" },
                { label: "Total Cobrado", value: formatCurrency(totalPaid), color: "#10B981" },
                { label: "Pendiente", value: formatCurrency(balance), color: "#DC2626" },
                { label: "Estado", value: document.status?.name || "Sin estado", color: "#6366F1" },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", mb: 0.5, letterSpacing: "0.05em" }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Box>

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
                  <Box
                    sx={{
                      px: 1,
                      py: 0.2,
                      bgcolor: "#EEF2FF",
                      borderRadius: "20px",
                      border: "1px solid #C7D2FE",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 800, color: "#4338CA" }}>
                      {rowData.length} registros
                    </Typography>
                  </Box>
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
                  </Tooltip>

                  <Tooltip title="Exportar CSV">
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
                  height: 360, 
                  borderRadius: 0,
                  borderTop: "1px solid #E5E7EB"
                }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>FECHA</TableCell>
                      <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>REFERENCIA</TableCell>
                      <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>MÉTODO</TableCell>
                      <TableCell align="right" sx={{ fontSize: '10px', fontWeight: 800, color: '#64748b', bgcolor: '#f8fafc' }}>IMPORTE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowData.filter(row => 
                      row.ref.toLowerCase().includes(quickFilter.toLowerCase()) ||
                      row.method.toLowerCase().includes(quickFilter.toLowerCase())
                    ).map((row) => (
                      <TableRow 
                        key={row.id}
                        sx={{ 
                          '&:hover': { bgcolor: '#f8fafc' },
                          opacity: row.status === 'reversed' ? 0.5 : 1,
                          textDecoration: row.status === 'reversed' ? 'line-through' : 'none'
                        }}
                      >
                        <TableCell sx={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>{row.date}</TableCell>
                        <TableCell sx={{ fontSize: '12px', color: '#111827', fontWeight: 500 }}>{row.ref}</TableCell>
                        <TableCell sx={{ fontSize: '12px', color: '#374151' }}>
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
                        <TableCell align="right" sx={{ fontSize: '12px', fontWeight: 700, color: row.amount < 0 ? "#DC2626" : "#111827" }}>
                          {formatCurrency(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
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

            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Clock size={16} color="#6B7280" />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700 }}>
                  Vencimiento
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#DC2626" }}>
                  {document.due_date || "N/A"}
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", color: "#6B7280" }}>
                  Emisión: {document.issue_date || "—"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                p: 2.2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
                <StickyNote size={14} color="#6B7280" />
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
                  Notas del documento
                </Typography>
              </Box>
              <Stack spacing={1.1}>
                {notes.map((note) => (
                  <Box
                    key={note.id}
                    sx={{
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      p: 1.2,
                      bgcolor: "#F9FAFB",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.4 }}>
                      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>
                        {note.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: "#9CA3AF" }}>
                        {note.date}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.76rem", color: "#4B5563" }}>
                      {note.text}
                    </Typography>
                    <Typography sx={{ mt: 0.4, fontSize: "0.65rem", fontWeight: 700, color: "#6366F1" }}>
                      {note.author}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                p: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
                <FileText size={14} color="#6B7280" />
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
                  Comentarios de Gestión
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: "#6B7280",
                  whiteSpace: "pre-wrap",
                  minHeight: 48,
                  lineHeight: 1.6,
                }}
              >
                {document.notes || "Ninguna observación registrada."}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
