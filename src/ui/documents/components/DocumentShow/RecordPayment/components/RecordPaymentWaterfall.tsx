import { Box, Typography, Tooltip, Paper, Checkbox } from '@mui/material';
import { AlertCircle, Info } from 'lucide-react';

interface WaterfallInvoice {
    id: number;
    number_serie: string;
    issue_date?: string | null;
    balance: number;
    allocation: number;
    isSelected: boolean;
}

interface RecordPaymentWaterfallProps {
    invoices: WaterfallInvoice[];
    onToggle: (id: number) => void;
    formatMoney: (val: number) => string;
}

export function RecordPaymentWaterfall({ invoices, onToggle, formatMoney }: RecordPaymentWaterfallProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    PARTIDAS ABIERTAS <Tooltip title="Seleccione facturas para la cascada"><AlertCircle size={12} /></Tooltip>
                </Typography>
            </Box>

            {/* Banner Informativo de Comportamiento por Defecto */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 1.5, 
                p: 1.5, 
                bgcolor: '#f0f7ff', 
                borderLeft: '4px solid #005483',
                mb: 0.5
            }}>
                <Info size={16} color="#005483" style={{ marginTop: 2 }} />
                <Typography variant="caption" sx={{ color: '#005483', fontWeight: 600, lineHeight: 1.4 }}>
                    <strong>Conciliación Automática:</strong> Por defecto, el pago consignado se aplicará prioritariamente para saldar las deudas de las facturas pendientes asociadas a este documento.
                </Typography>
            </Box>

            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                maxHeight: '280px', 
                overflowY: 'auto',
                gap: 0.75
            }}>
                {invoices.map((invoice) => (
                    <Paper
                        key={invoice.id}
                        elevation={0}
                        onClick={() => onToggle(invoice.id)}
                        sx={{
                            px: 2,
                            py: 1.2,
                            border: '1px solid',
                            borderColor: invoice.isSelected ? '#005483' : '#e2e8f0',
                            borderRadius: 0,
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                            bgcolor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            '&:hover': {
                                borderColor: '#005483',
                                bgcolor: '#f8fafc'
                            },
                            borderLeft: invoice.isSelected ? '4px solid #005483' : '1px solid #e2e8f0'
                        }}
                    >
                        <Checkbox
                            checked={invoice.isSelected}
                            size="small"
                            sx={{ p: 0, color: '#cbd5e1', '&.Mui-checked': { color: '#005483' } }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                {invoice.number_serie}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                {invoice.issue_date || 'Sin fecha'}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', minWidth: '100px' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.6rem', display: 'block' }}>
                                PENDIENTE
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                                {formatMoney(invoice.balance)}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', minWidth: '120px', bgcolor: invoice.isSelected ? '#f0f9ff' : 'transparent', px: 1, py: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#005483', fontWeight: 800, fontSize: '0.6rem', display: 'block' }}>
                                A COBRAR
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: invoice.isSelected ? '#107e3e' : '#94a3b8' }}>
                                {formatMoney(invoice.allocation)}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
