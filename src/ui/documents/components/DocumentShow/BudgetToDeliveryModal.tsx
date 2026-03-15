import { Box, MenuItem, CircularProgress, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';

interface BudgetToDeliveryModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
    onConvert: (payload: { 
        number_series_id: number; 
        status_key: string;
        partner_data?: { vat_number: string; cif: string }
    }) => void;
    isConverting: boolean;
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

export function BudgetToDeliveryModal({ open, onClose, document, onConvert, isConverting }: BudgetToDeliveryModalProps) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const [vatNumber, setVatNumber] = useState(document.partner_vat_number || '');
    const [cif, setCif] = useState(document.partner_cif || '');
    
    const selectedStatusKey = 'draft'; // Conversion from budget always goes to draft delivery

    // Which delivery type do we need series for? QUO -> DLV, PQUO -> PDLV
    const targetType = document.document_type_code === 'QUO' ? 'DLV' : 'PDLV';

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
        
        const payload: any = { 
            number_series_id: selectedSeriesId, 
            status_key: selectedStatusKey 
        };

        // Only send partner data if we are in a sales flow and fields are filled
        if (document.operation === 'sale' && (vatNumber || cif)) {
            payload.partner_data = {
                vat_number: vatNumber,
                cif: cif
            };
        }

        onConvert(payload);
    };

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title="Convertir Presupuesto a Albarán"
            onConfirm={handleSave}
            confirmText={isConverting ? "Procesando..." : "Crear Albarán Borrador"}
            isConfirmDisabled={!selectedSeriesId || isConverting}
            PaperProps={{
                sx: {
                    width: '590px',
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
                                Parámetros del Albarán
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                label="Serie de numeración (Albaranes)"
                                variant="filled"
                                value={selectedSeriesId}
                                onChange={(e) => setSelectedSeriesId(Number(e.target.value) || '')}
                                size="small"
                                helperText={!selectedSeriesId ? "Seleccione la serie para el nuevo albarán" : ""}
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

                        {document.operation === 'sale' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 0, display: 'block' }}>
                                    Datos Fiscales (Promoción a Cliente)
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="CIF / NIF"
                                        variant="outlined"
                                        size="small"
                                        value={cif}
                                        onChange={(e) => setCif(e.target.value)}
                                        placeholder="B12345678"
                                    />
                                    <TextField
                                        fullWidth
                                        label="VAT Number"
                                        variant="outlined"
                                        size="small"
                                        value={vatNumber}
                                        onChange={(e) => setVatNumber(e.target.value)}
                                        placeholder="ESB12345678"
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                    Al completar estos datos, el prospecto se convertirá automáticamente en cliente.
                                </Typography>
                            </Box>
                        )}

                        {previewNumber && (
                            <Box sx={{
                                bgcolor: 'grey.50',
                                p: 2,
                                borderRadius: 1,
                                borderLeft: '4px solid',
                                borderColor: 'info.main',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                        Próximo Número de Albarán
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: 1 }}>
                                        {previewNumber}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 600, display: 'block' }}>
                                        ESTADO: BORRADOR
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
