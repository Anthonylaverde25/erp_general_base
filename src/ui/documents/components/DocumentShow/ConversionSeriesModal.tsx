import { Box, MenuItem, CircularProgress, TextField, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
import { FileText, CheckCircle, Landmark } from 'lucide-react';

interface ConversionSeriesModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
    onConvert: (payload: { 
        number_series_id: number; 
        status_key: string;
        lines?: { source_line_id: number; quantity: number }[];
    }) => void;
    isConverting: boolean;
    mode: 'full' | 'partial';
    title?: string;
    targetType?: string; // Explicitly define which series to look for
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

export function ConversionSeriesModal({ 
    open, 
    onClose, 
    document, 
    onConvert, 
    isConverting, 
    mode, 
    title,
    targetType: propTargetType
}: ConversionSeriesModalProps) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const [lineQuantities, setLineQuantities] = useState<Record<number, number>>({});
    const selectedStatusKey = 'issued'; 

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    useEffect(() => {
        if (open && document.lines) {
            const initialQtys: Record<number, number> = {};
            document.lines.forEach(line => {
                if (line.id) {
                    const pending = line.quantity - (line.processed_quantity || 0);
                    initialQtys[line.id] = pending > 0 ? pending : 0;
                }
            });
            setLineQuantities(initialQtys);
            setSelectedSeriesId(''); // Reset selection when opening
        }
    }, [open, document]);

    const handleQuantityChange = (lineId: number, val: string, max: number) => {
        const num = parseFloat(val);
        setLineQuantities(prev => ({
            ...prev,
            [lineId]: isNaN(num) ? 0 : Math.min(num, max)
        }));
    };

    // Determine which series to fetch
    const finalTargetType = useMemo(() => {
        if (propTargetType) return propTargetType;
        
        // Fallback logic if no targetType is provided
        const code = document.document_type_code;
        if (code === 'DLV') return 'INV';
        if (code === 'PDLV') return 'PINV';
        return code || ''; // Emission mode: same as current doc
    }, [propTargetType, document.document_type_code]);

    const { data: numberSeries, isLoading: isLoadingSeries } = useQuery({
        queryKey: ['number-series-for-conversion', document.company_id, finalTargetType],
        queryFn: () => numberSeriesRepository.index(finalTargetType),
        enabled: open && !!finalTargetType,
    });

    const previewNumber = useMemo(() => {
        if (!selectedSeriesId || !numberSeries) return null;
        const series = numberSeries.find(ns => ns.id === selectedSeriesId);
        if (!series) return null;
        const nextNumber = series.current_number + 1;
        return `${series.serie}-${series.year}-${String(nextNumber).padStart(6, '0')}`;
    }, [selectedSeriesId, numberSeries]);

    const isTotalProcessZero = useMemo(() => {
        if (mode === 'full') return false;
        return Object.values(lineQuantities).reduce((acc, curr) => acc + curr, 0) <= 0;
    }, [lineQuantities, mode]);

    const handleSave = () => {
        if (!selectedSeriesId) return;

        let linesPayload;
        if (mode === 'full') {
            linesPayload = document.lines
                .map(line => ({ 
                    source_line_id: line.id!, 
                    quantity: line.quantity - (line.processed_quantity || 0) 
                }))
                .filter(l => l.quantity > 0);
        } else {
            linesPayload = Object.entries(lineQuantities)
                .filter(([_, qty]) => qty > 0)
                .map(([id, qty]) => ({ source_line_id: Number(id), quantity: qty }));
        }

        onConvert({ 
            number_series_id: selectedSeriesId, 
            status_key: selectedStatusKey,
            lines: linesPayload
        });
    };

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '6px', 
                        bgcolor: 'indigo.50', 
                        color: 'indigo.600', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <FileText size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {title || (mode === 'full' ? 'Facturación Directa' : 'Certificación por Líneas')}
                    </Typography>
                </Box>
            }
            onConfirm={handleSave}
            confirmText={isConverting ? "Procesando..." : "Confirmar Emisión"}
            isConfirmDisabled={!selectedSeriesId || isConverting || isTotalProcessZero}
            PaperProps={{ 
                sx: { 
                    width: mode === 'full' ? '400px' : '720px', 
                    maxWidth: '95vw',
                    borderRadius: '4px',
                    bgcolor: '#ffffff',
                    boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
                    overflow: 'hidden'
                } 
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    px: 3,
                    py: 2,
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ bgcolor: '#005483', p: 0.8, borderRadius: '4px', display: 'flex', color: 'white' }}>
                            <FileText size={18} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                {title || (mode === 'full' ? 'Facturación Directa' : 'Certificación por Líneas')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                {document.number_serie} • {document.partner_name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {isLoadingSeries ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={28} thickness={4} color="secondary" />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
                                        Serie de Numeración Legal ({finalTargetType})
                                    </Typography>
                                    <TextField
                                        id="filled-basic"
                                        select
                                        fullWidth
                                        variant="filled"
                                        label="Seleccione serie legal"
                                        value={selectedSeriesId}
                                        onChange={(e) => setSelectedSeriesId(Number(e.target.value) || '')}
                                        size="small"
                                        sx={{ 
                                            '& .MuiInputBase-input': { fontSize: '13px', fontWeight: 600 }
                                        }}
                                    >
                                        <MenuItem value="" disabled><em className="text-gray-400">Seleccione la serie de numeración...</em></MenuItem>
                                        {numberSeries?.map((ns) => (
                                            <MenuItem key={ns.id} value={ns.id} sx={{ fontSize: '13px' }}>
                                                Serie {ns.serie} (Próximo: {ns.current_number + 1})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                {(document.total_paid || 0) > 0 && (
                                    <Box sx={{
                                        mt: 1.5,
                                        p: 2,
                                        borderRadius: '4px',
                                        bgcolor: '#f0fdf4',
                                        border: '1px solid #dcfce7',
                                        borderLeft: '4px solid #10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Box sx={{ 
                                            p: 0.8, 
                                            bgcolor: '#dcfce7', 
                                            color: '#166534', 
                                            borderRadius: '4px',
                                            display: 'flex'
                                        }}>
                                            <Landmark size={18} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#14532d', lineHeight: 1.2, mb: 0.2 }}>
                                                Abono Registrado en Albarán
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#166534', fontSize: '12.5px', fontWeight: 600 }}>
                                                Este documento ya cuenta con un pago de <span style={{ fontWeight: 900 }}>{formatCurrency(document.total_paid || 0)}</span>. 
                                                El sistema aplicará este saldo a la factura resultante.
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                
                                {previewNumber && (
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        width: '100%',
                                        mt: 1.5,
                                        px: 2,
                                        py: 1.5,
                                        borderLeft: '4px solid #005483',
                                        bgcolor: '#f0f9ff',
                                        border: '1px solid #e0f2fe',
                                        borderLeftColor: '#005483',
                                        borderRadius: '4px'
                                    }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#005483', textTransform: 'uppercase', fontSize: '10px', mb: 0.5, letterSpacing: '0.5px' }}>
                                            Nº Documento Oficial a Generar
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 900, color: '#0c4a6e', letterSpacing: '1px', fontSize: '16px' }}>
                                                {previewNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            {mode === 'partial' && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Líneas a Procesar
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                            Seleccione las cantidades para la facturación parcial.
                                        </Typography>
                                    </Box>
                                    
                                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                                    <TableCell sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Producto / Servicio</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', width: '100px' }}>Estado</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', width: '80px' }}>Pend.</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', width: '140px' }}>A Facturar</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {document.lines.map((line) => {
                                                    const pending = line.quantity - (line.processed_quantity || 0);
                                                    const isDone = pending <= 0;
                                                    
                                                    return (
                                                        <TableRow 
                                                            key={line.id} 
                                                            sx={{ 
                                                                '&:hover': { bgcolor: '#f1f5f9' },
                                                                transition: 'background-color 0.1s',
                                                                '& td': { py: 1, px: 2, borderBottom: '1px solid #f1f5f9' }
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: isDone ? '#94a3b8' : '#1e293b', fontSize: '13px' }}>
                                                                    {line.name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box sx={{ 
                                                                    display: 'inline-flex', 
                                                                    px: 1, 
                                                                    py: 0.25, 
                                                                    borderRadius: '2px', 
                                                                    fontSize: '9px', 
                                                                    fontWeight: 900,
                                                                    bgcolor: isDone ? '#f0fdf4' : '#eff6ff',
                                                                    color: isDone ? '#166534' : '#1e40af',
                                                                    border: '1px solid',
                                                                    borderColor: isDone ? '#bbf7d0' : '#bfdbfe'
                                                                }}>
                                                                    {isDone ? 'COMPLETO' : 'PENDIENTE'}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" sx={{ fontWeight: 800, color: isDone ? '#94a3b8' : '#0f172a', fontSize: '13px' }}>
                                                                    {pending.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {!isDone ? (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                                        <TextField
                                                                            id="quantity-input"
                                                                            type="number"
                                                                            size="small"
                                                                            variant="filled"
                                                                            value={lineQuantities[line.id!] || 0}
                                                                            onChange={(e) => handleQuantityChange(line.id!, e.target.value, pending)}
                                                                            inputProps={{ 
                                                                                style: { textAlign: 'right', fontWeight: 800, fontSize: '13px', paddingTop: '8px', color: '#005483' } 
                                                                            }}
                                                                            sx={{ width: '85px', '& .MuiFilledInput-root': { height: '32px', borderRadius: '4px' } }}
                                                                        />
                                                                    </Box>
                                                                ) : (
                                                                    <CheckCircle className="text-emerald-600" size={16} />
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Bloque de Resumen de Totales - Estilo Waterfall */}
                                    <Box sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: '#f8fafc',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                                                Total de Mercancía Seleccionada
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                {formatCurrency(Object.entries(lineQuantities).reduce((acc, [id, qty]) => {
                                                    const line = document.lines.find(l => l.id === Number(id));
                                                    return acc + (qty * (line?.unit_price || 0));
                                                }, 0))}
                                            </Typography>
                                        </Box>

                                        {(document.total_paid || 0) > 0 && (
                                            <>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Landmark size={14} className="text-emerald-600" />
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'emerald.700' }}>
                                                            Abono del Albarán Aplicable
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'emerald.700' }}>
                                                        - {formatCurrency(document.total_paid || 0)}
                                                    </Typography>
                                                </Box>
                                                <Divider sx={{ borderStyle: 'dashed' }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#005483', textTransform: 'uppercase' }}>
                                                        Saldo Neto en Factura Hija
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#005483' }}>
                                                        {formatCurrency(Math.max(0, Object.entries(lineQuantities).reduce((acc, [id, qty]) => {
                                                            const line = document.lines.find(l => l.id === Number(id));
                                                            return acc + (qty * (line?.unit_price || 0));
                                                        }, 0) - (document.total_paid || 0)))}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </AppFormModal>
    );
}
