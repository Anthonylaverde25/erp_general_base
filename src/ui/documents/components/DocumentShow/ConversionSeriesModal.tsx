import { Box, MenuItem, CircularProgress, TextField, Typography, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
import { FileText, ArrowRight, LayoutList } from 'lucide-react';

interface ConversionSeriesModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
    onConvert: (payload: { number_series_id: number; status_key: string }) => void;
    isConverting: boolean;
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

export function ConversionSeriesModal({ open, onClose, document, onConvert, isConverting }: ConversionSeriesModalProps) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const selectedStatusKey = 'issued'; // Direct conversion always defaults to issued

    // Which invoice type do we need series for? DLV -> INV, PDLV -> PINV
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

    const handleSave = () => {
        if (!selectedSeriesId) return;
        onConvert({ number_series_id: selectedSeriesId, status_key: selectedStatusKey });
    };

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title="Facturar Albarán"
            onConfirm={handleSave}
            confirmText={isConverting ? "Procesando..." : "Emitir Factura"}
            isConfirmDisabled={!selectedSeriesId || isConverting}
            PaperProps={{
                sx: {
                    width: '590px', // Aprox 15% more than previous 510px
                    maxWidth: '590px'
                }
            }}
        >
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {isLoadingSeries ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} thickness={4} color="secondary" />
                    </Box>
                ) : (
                    <>
                        <Box>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                Parámetros de Facturación
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                id="filled-basic"
                                label="Serie de numeración"
                                variant="filled"
                                value={selectedSeriesId}
                                onChange={(e) => setSelectedSeriesId(Number(e.target.value) || '')}
                                size="small"
                                helperText={!selectedSeriesId ? "Seleccione la serie legal necesaria para la facturación" : ""}
                            >
                                <MenuItem value="" disabled>
                                    <em>Seleccione una serie...</em>
                                </MenuItem>
                                {numberSeries?.map((ns) => (
                                    <MenuItem key={ns.id} value={ns.id}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <Typography variant="body2" fontWeight={500}>Serie {ns.serie}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>Contador: {ns.current_number}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {previewNumber && (
                            <Box sx={{
                                bgcolor: 'grey.50',
                                p: 2,
                                borderRadius: 1,
                                borderLeft: '4px solid',
                                borderColor: 'secondary.main',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                        Próximo Número Asignado
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: 1 }}>
                                        {previewNumber}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, display: 'block' }}>
                                        ESTADO: EMITIDA
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Asignación automática
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </AppFormModal>
    );
}
