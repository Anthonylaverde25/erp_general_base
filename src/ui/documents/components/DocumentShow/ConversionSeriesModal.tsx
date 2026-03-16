import { Box, MenuItem, CircularProgress, TextField, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
import { FileText, ArrowRight, LayoutList, CheckCircle } from 'lucide-react';

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
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

export function ConversionSeriesModal({ open, onClose, document, onConvert, isConverting, mode }: ConversionSeriesModalProps) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const [lineQuantities, setLineQuantities] = useState<Record<number, number>>({});
    const selectedStatusKey = 'issued'; 

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
        }
    }, [open, document]);

    const handleQuantityChange = (lineId: number, val: string, max: number) => {
        const num = parseFloat(val);
        setLineQuantities(prev => ({
            ...prev,
            [lineId]: isNaN(num) ? 0 : Math.min(num, max)
        }));
    };

    const resetQuantity = (lineId: number, max: number) => {
        setLineQuantities(prev => ({ ...prev, [lineId]: max }));
    };

    const targetType = document.document_type_code === 'DLV' ? 'INV' : 'PINV';

    const { data: numberSeries, isLoading: isLoadingSeries } = useQuery({
        queryKey: ['number-series-for-conversion', document.company_id, targetType],
        queryFn: () => numberSeriesRepository.index(targetType),
        enabled: open,
    });

    const previewNumber = useMemo(() => {
        if (!selectedSeriesId || !numberSeries) return null;
        const series = numberSeries.find(ns => ns.id === selectedSeriesId);
        if (!series) return null;
        const nextNumber = series.current_number + 1;
        return `${series.serie}-${String(nextNumber).padStart(6, '0')}`;
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
                        {mode === 'full' ? 'Facturación Directa' : 'Certificación por Líneas'}
                    </Typography>
                </Box>
            }
            onConfirm={handleSave}
            confirmText={isConverting ? "Procesando..." : "Emitir Factura"}
            isConfirmDisabled={!selectedSeriesId || isConverting || isTotalProcessZero}
            PaperProps={{ 
                sx: { 
                    width: mode === 'full' ? '400px' : '750px', 
                    maxWidth: '95vw',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                } 
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                                        Serie de Facturación
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
                                                Serie {ns.serie} (Contador actual: {ns.current_number})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                
                                {previewNumber && (
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        width: '100%',
                                        px: 1.5,
                                        py: 1,
                                        borderLeft: '3px solid',
                                        borderColor: 'indigo.400',
                                        bgcolor: 'indigo.50/50',
                                        borderRadius: '0 4px 4px 0'
                                    }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'indigo.600', textTransform: 'uppercase', fontSize: '10px', mb: 0.5 }}>
                                            Nº Próxima Factura
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 800, color: 'indigo.900', letterSpacing: '1px', fontSize: '16px' }}>
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
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Líneas del Albarán a Facturar
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Cantidades para esta factura (Certificación).
                                        </Typography>
                                    </Box>
                                    
                                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid', borderColor: 'grey.200' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                                    <TableCell sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200' }}>Producto</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200', width: '100px' }}>Estado</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200', width: '80px' }}>Pend.</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200', width: '160px' }}>Facturar</TableCell>
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
                                                                '&:hover': { bgcolor: 'grey.50' },
                                                                transition: 'background-color 0.2s',
                                                                '& td': { py: 1.5, px: 2, borderBottom: '1px solid', borderColor: 'grey.100' }
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: isDone ? 'text.disabled' : 'text.primary', fontSize: '13px' }}>
                                                                    {line.name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box sx={{ 
                                                                    display: 'inline-flex', 
                                                                    px: 1, 
                                                                    py: 0.25, 
                                                                    borderRadius: '4px', 
                                                                    fontSize: '9px', 
                                                                    fontWeight: 800,
                                                                    bgcolor: isDone ? 'success.50' : 'info.50',
                                                                    color: isDone ? 'success.700' : 'info.700',
                                                                    border: '1px solid',
                                                                    borderColor: isDone ? 'success.100' : 'info.100'
                                                                }}>
                                                                    {isDone ? 'FACTURADO' : 'PENDIENTE'}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: isDone ? 'text.disabled' : 'text.primary', fontSize: '13px' }}>
                                                                    {pending.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {!isDone ? (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                                        <TextField
                                                                            id="filled-basic"
                                                                            type="number"
                                                                            size="small"
                                                                            variant="filled"
                                                                            value={lineQuantities[line.id!] || 0}
                                                                            onChange={(e) => handleQuantityChange(line.id!, e.target.value, pending)}
                                                                            inputProps={{ 
                                                                                style: { textAlign: 'right', fontWeight: 700, fontSize: '13px', paddingTop: '8px' } 
                                                                            }}
                                                                            sx={{ width: '90px', '& .MuiFilledInput-root': { height: '36px' } }}
                                                                        />
                                                                    </Box>
                                                                ) : (
                                                                    <CheckCircle className="text-emerald-500" size={18} />
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </AppFormModal>
    );
}
