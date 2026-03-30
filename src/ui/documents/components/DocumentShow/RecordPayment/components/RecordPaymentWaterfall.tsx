import { Box, Typography, Tooltip, Paper, Checkbox, InputBase, IconButton } from '@mui/material';
import { AlertCircle, Info, RotateCcw } from 'lucide-react';

interface WaterfallInvoice {
    id: number;
    number_serie: string;
    issue_date?: string | null;
    balance: number;
    allocation: number;
    isSelected: boolean;
    isManual: boolean;
}

interface RecordPaymentWaterfallProps {
    invoices: WaterfallInvoice[];
    onToggle: (id: number) => void;
    onManualAmount: (id: number, val: number | null) => void;
    formatMoney: (val: number) => string;
}

export function RecordPaymentWaterfall({ 
    invoices, 
    onToggle, 
    onManualAmount, 
    formatMoney 
}: RecordPaymentWaterfallProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    PARTIDAS ABIERTAS <Tooltip title="Seleccione facturas para la cascada"><AlertCircle size={12} /></Tooltip>
                </Typography>
            </Box>

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
                    <strong>Conciliación Automática:</strong> El sistema prioriza saldar deudas de facturas. Puede editar el monto de cobro manualmente en cada factura seleccionada.
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
                        sx={{
                            px: 2,
                            py: 1.2,
                            border: '1px solid',
                            borderColor: invoice.isSelected ? '#005483' : '#e2e8f0',
                            borderRadius: 0,
                            cursor: 'default',
                            transition: 'all 0.1s',
                            bgcolor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            borderLeft: invoice.isSelected ? '4px solid #005483' : '1px solid #e2e8f0'
                        }}
                    >
                        <Checkbox
                            checked={invoice.isSelected}
                            onChange={() => onToggle(invoice.id)}
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
                        
                        <Box sx={{ textAlign: 'right', minWidth: '90px' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.6rem', display: 'block' }}>
                                PENDIENTE
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                                {formatMoney(invoice.balance)}
                            </Typography>
                        </Box>

                        <Box sx={{ 
                            textAlign: 'right', 
                            minWidth: '140px', 
                            bgcolor: invoice.isSelected ? '#f0f9ff' : 'transparent', 
                            px: 1.5, 
                            py: 0.5,
                            border: invoice.isManual ? '1px dashed #005483' : 'none'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
                                {invoice.isManual && (
                                    <Tooltip title="Resetear a automático">
                                        <IconButton size="small" onClick={() => onManualAmount(invoice.id, null)} sx={{ p: 0.2 }}>
                                            <RotateCcw size={12} color="#005483" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Typography variant="caption" sx={{ color: '#005483', fontWeight: 800, fontSize: '0.6rem' }}>
                                    A COBRAR {invoice.isManual ? '(MANUAL)' : ''}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: invoice.isSelected ? '#107e3e' : '#94a3b8', mr: 0.5 }}>€</Typography>
                                <InputBase
                                    value={invoice.allocation}
                                    type="number"
                                    disabled={!invoice.isSelected}
                                    onChange={(e) => onManualAmount(invoice.id, Number(e.target.value))}
                                    sx={{ 
                                        fontWeight: 800, 
                                        color: invoice.isSelected ? '#107e3e' : '#94a3b8',
                                        fontSize: '0.875rem',
                                        width: '80px',
                                        '& input': { textAlign: 'right', p: 0 }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
