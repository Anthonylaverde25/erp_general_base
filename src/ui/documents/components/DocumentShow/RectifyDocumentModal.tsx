import { Box, MenuItem, CircularProgress, TextField, Typography, Paper, Alert, AlertTitle } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
import { FileText, AlertTriangle } from 'lucide-react';

interface RectifyDocumentModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
    onRectify: (payload: { 
        number_series_id: number; 
        reason?: string;
    }) => void;
    isRectifying: boolean;
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

export function RectifyDocumentModal({ 
    open, 
    onClose, 
    document, 
    onRectify, 
    isRectifying 
}: RectifyDocumentModalProps) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (open) {
            setSelectedSeriesId('');
            setReason('');
        }
    }, [open]);

    // Credit Note / Factura Rectificativa type is CRN
    const targetType = 'CRN';

    const { data: numberSeries, isLoading: isLoadingSeries } = useQuery({
        queryKey: ['number-series-for-rectification', document.company_id, targetType],
        queryFn: () => numberSeriesRepository.index(targetType),
        enabled: open,
    });

    const previewNumber = useMemo(() => {
        if (!selectedSeriesId || !numberSeries) return null;
        const series = numberSeries.find(ns => ns.id === selectedSeriesId);
        if (!series) return null;
        const nextNumber = series.current_number + 1;
        return `${series.serie}-${series.year}-${String(nextNumber).padStart(6, '0')}`;
    }, [selectedSeriesId, numberSeries]);

    const handleConfirm = () => {
        if (!selectedSeriesId) return;

        onRectify({ 
            number_series_id: selectedSeriesId, 
            reason: reason.trim() || undefined
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
                        bgcolor: 'error.50', 
                        color: 'error.700', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <AlertTriangle size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'error.700' }}>
                        Rectificar Factura de Venta
                    </Typography>
                </Box>
            }
            onConfirm={handleConfirm}
            confirmText={isRectifying ? "Procesando..." : "Confirmar Anulación"}
            isConfirmDisabled={!selectedSeriesId || isRectifying}
            PaperProps={{ 
                sx: { 
                    width: '450px', 
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
                    bgcolor: '#fdf2f2',
                    borderBottom: '1px solid #fde8e8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9b1c1c' }}>
                                Documento a Anular
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#c81e1e', fontWeight: 600 }}>
                                {document.number_serie} • {document.partner_name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {isLoadingSeries ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={28} thickness={4} color="error" />
                    </Box>
                ) : (
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Alert severity="warning" variant="outlined" sx={{ borderRadius: '4px', borderStyle: 'solid' }}>
                            <AlertTitle sx={{ fontWeight: 700 }}>Atención Fiscal e Impositiva</AlertTitle>
                            Esta acción registrará una <strong>Factura Rectificativa (CRN)</strong> que anulará el cargo original. La factura de origen ({document.number_serie}) cambiará de estado a <strong>Anulada / Cancelada</strong>.
                        </Alert>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
                                    Serie de Numeración Rectificativa (CRN)
                                </Typography>
                                <TextField
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

                            <Box sx={{ width: '100%' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
                                    Motivo de la Rectificación (Opcional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Describa el motivo..."
                                    multiline
                                    rows={2}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    size="small"
                                    inputProps={{ style: { fontSize: '13px', fontWeight: 500 } }}
                                />
                            </Box>

                            {previewNumber && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    width: '100%',
                                    mt: 1,
                                    px: 2,
                                    py: 1.5,
                                    bgcolor: '#fdf2f2',
                                    border: '1px solid #fde8e8',
                                    borderLeft: '4px solid #c81e1e',
                                    borderRadius: '4px'
                                }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#c81e1e', textTransform: 'uppercase', fontSize: '10px', mb: 0.5, letterSpacing: '0.5px' }}>
                                        Nº Rectificativa a Generar
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 900, color: '#9b1c1c', letterSpacing: '1px', fontSize: '16px' }}>
                                        {previewNumber}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </AppFormModal>
    );
}
