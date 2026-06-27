import { useState, useEffect, useMemo } from 'react';
import { Box, MenuItem, CircularProgress, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle } from 'lucide-react';

import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
import axiosInstance from '@/lib/@axios';

// --- Esquemas y Tipos ---

const rectifySchema = z.object({
    number_series_id: z.number({ required_error: 'Debe seleccionar una serie' }),
    reason_id: z.number({ required_error: 'Debe seleccionar un motivo' }),
    rectification_type_id: z.number({ required_error: 'Debe seleccionar el tipo fiscal de rectificación' }),
    rectification_modality_id: z.number({ required_error: 'Debe seleccionar la modalidad de rectificación' }),
    notes: z.string().optional(),
});

export type RectifyFormValues = z.infer<typeof rectifySchema>;

interface Reason { id: number; country_code: string; code: string; label: string; reason: string; is_active: boolean; }
interface RectificationType { id: number; country_code: string; code: string; label: string; description: string; is_active: boolean; }
interface RectificationModality { id: number; country_code: string; code: string; label: string; is_active: boolean; }

interface RectifyDocumentModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
    onRectify: (payload: RectifyFormValues & { serial_comments?: Record<string, string> }) => void;
    isRectifying: boolean;
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

// --- Estilos Comunes (DRY) ---
const labelSx = { fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' };
const inputSx = { '& .MuiInputBase-input': { fontSize: '13px', fontWeight: 600 } };

export function RectifyDocumentModal({
    open,
    onClose,
    document,
    onRectify,
    isRectifying
}: RectifyDocumentModalProps) {

    // --- Estados ---
    const [reasons, setReasons] = useState<Reason[]>([]);
    const [rectificationTypes, setRectificationTypes] = useState<RectificationType[]>([]);
    const [rectificationModalities, setRectificationModalities] = useState<RectificationModality[]>([]);
    const [serialComments, setSerialComments] = useState<Record<string, string>>({});

    // --- Carga de Catálogos (Optimizada con Promise.all) ---
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [resReasons, resTypes, resModalities] = await Promise.all([
                    axiosInstance.get('/cancelation-reasons'),
                    axiosInstance.get('/rectification-types'),
                    axiosInstance.get('/rectification-modalities')
                ]);

                setReasons(resReasons.data.reasons);
                setRectificationTypes(resTypes.data.types);
                setRectificationModalities(resModalities.data.modalities);
            } catch (error) {
                console.error("Error al cargar los catálogos de rectificación:", error);
            }
        };

        if (open) fetchCatalogs();
    }, [open]);

    // --- Configuración de React Hook Form ---
    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid }
    } = useForm<RectifyFormValues>({
        resolver: zodResolver(rectifySchema),
        mode: 'onChange',
        defaultValues: { notes: '' }
    });

    useEffect(() => {
        if (open) {
            reset();
            setSerialComments({});
        }
    }, [open, reset]);

    // --- Consultas y Lógica Derivada ---
    const targetType = 'CRN';

    const { data: numberSeries, isLoading: isLoadingSeries } = useQuery({
        queryKey: ['number-series-for-rectification', document.company_id, targetType],
        queryFn: () => numberSeriesRepository.index(targetType),
        enabled: open,
    });

    const watchedSeriesId = watch('number_series_id');

    const previewNumber = useMemo(() => {
        if (!watchedSeriesId || !numberSeries) return null;
        const series = numberSeries.find(ns => ns.id === watchedSeriesId);
        if (!series) return null;
        return `${series.serie}-${series.year}-${String(series.current_number + 1).padStart(6, '0')}`;
    }, [watchedSeriesId, numberSeries]);

    const serializedLines = useMemo(() => {
        return document.lines.filter(l => l.has_serials && l.meta?.serial_numbers && l.meta.serial_numbers.length > 0);
    }, [document]);

    const hasSerializedItems = serializedLines.length > 0;

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 32, height: 32, borderRadius: '6px',
                        bgcolor: 'error.50', color: 'error.700',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AlertTriangle size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'error.700' }}>
                        Rectificar Factura de Venta
                    </Typography>
                </Box>
            }
            onConfirm={handleSubmit((values) => onRectify({ ...values, serial_comments: serialComments }))}
            confirmText={isRectifying ? "Procesando..." : "Confirmar Anulación"}
            isConfirmDisabled={!isValid || isRectifying}
            maxWidth={hasSerializedItems ? "md" : "sm"}
            PaperProps={{
                sx: {
                    width: hasSerializedItems ? '850px' : '450px', maxWidth: '95vw', borderRadius: '4px',
                    bgcolor: '#ffffff', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* Encabezado Optimizado */}
                <Box sx={{ px: 3, py: 2, bgcolor: '#fdf2f2', borderBottom: '1px solid #fde8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9b1c1c' }}>
                                Documento a Anular
                            </Typography>
                            <Typography>
                                Se emitirá una <strong>Factura Rectificativa (CRN)</strong> para anular el cargo. El documento de origen ({document.number_serie}) pasará a estado <strong>Anulado</strong>.
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
                    <Box sx={{ display: 'flex', flexDirection: hasSerializedItems ? 'row' : 'column' }}>
                        {/* Panel Izquierdo: Formulario Legal */}
                        <Box sx={{ 
                            p: 3, 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2.5, 
                            borderRight: hasSerializedItems ? '1px solid' : 'none', 
                            borderColor: 'divider',
                            maxWidth: hasSerializedItems ? '50%' : '100%'
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="caption" sx={labelSx}>Serie Rectificativa (CRN) *</Typography>
                                    <Controller
                                        name="number_series_id"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} select fullWidth variant="filled" label="Seleccione serie legal" size="small" error={!!errors.number_series_id} helperText={errors.number_series_id?.message} sx={inputSx}>
                                                {numberSeries?.map((ns) => (
                                                    <MenuItem key={ns.id} value={ns.id} sx={{ fontSize: '13px' }}>
                                                        Serie {ns.serie} (Próximo: {ns.current_number + 1})
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="caption" sx={labelSx}>Motivo de Anulación *</Typography>
                                    <Controller
                                        name="reason_id"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} select fullWidth variant="filled" label="Seleccione el motivo principal" size="small" error={!!errors.reason_id} helperText={errors.reason_id?.message} sx={inputSx}>
                                                {reasons?.map((reason) => (
                                                    <MenuItem key={reason.id} value={reason.id} sx={{ fontSize: '13px' }}>
                                                        {reason.code} - {reason.label} ({reason.reason})
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="caption" sx={labelSx}>Tipo de Factura Rectificativa *</Typography>
                                    <Controller
                                        name="rectification_type_id"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} select fullWidth variant="filled" label="Seleccione tipo fiscal (ej. R1)" size="small" error={!!errors.rectification_type_id} helperText={errors.rectification_type_id?.message} sx={inputSx}>
                                                {rectificationTypes?.map((type) => (
                                                    <MenuItem key={type.id} value={type.id} sx={{ fontSize: '13px' }} title={type.description}>
                                                        {type.code} - {type.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="caption" sx={labelSx}>Modalidad de Rectificación *</Typography>
                                    <Controller
                                        name="rectification_modality_id"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} select fullWidth variant="filled" label="Seleccione la modalidad" size="small" error={!!errors.rectification_modality_id} helperText={errors.rectification_modality_id?.message} sx={inputSx}>
                                                {rectificationModalities?.map((modality) => (
                                                    <MenuItem key={modality.id} value={modality.id} sx={{ fontSize: '13px' }}>
                                                        {modality.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="caption" sx={labelSx}>Notas Adicionales (Opcional)</Typography>
                                    <Controller
                                        name="notes"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} fullWidth variant="filled" label="Describa detalles adicionales..." multiline rows={2} size="small" error={!!errors.notes} helperText={errors.notes?.message} inputProps={{ style: { fontSize: '13px', fontWeight: 500 } }} />
                                        )}
                                    />
                                </Box>

                                {previewNumber && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', mt: 1, px: 2, py: 1.5, bgcolor: '#fdf2f2', border: '1px solid #fde8e8', borderLeft: '4px solid #c81e1e', borderRadius: '4px' }}>
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

                        {/* Panel Derecho: Comentarios de Devolución por Serie */}
                        {hasSerializedItems && (
                            <Box sx={{ 
                                p: 3, 
                                flex: 1, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 2,
                                bgcolor: '#fafafa',
                                overflowY: 'auto',
                                maxHeight: '480px',
                                maxWidth: '50%'
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
                                    Comentarios por Serie
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2 }}>
                                    Ingrese comentarios individuales para cada número de serie devuelto.
                                </Typography>

                                {serializedLines.map((line, lineIdx) => (
                                    <Box key={line.id || lineIdx} sx={{ mb: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <Box sx={{ px: 1, py: 0.5, bgcolor: 'secondary.50', color: 'secondary.700', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                                {line.item_code || 'PROD'}
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {line.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 1 }}>
                                            {line.meta?.serial_numbers?.map((sn) => (
                                                <Box key={sn}>
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                                        Nº Serie: {sn}
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        placeholder="Motivo de la devolución..."
                                                        multiline
                                                        rows={2}
                                                        size="small"
                                                        value={serialComments[sn] || ''}
                                                        onChange={(e) => setSerialComments(prev => ({ ...prev, [sn]: e.target.value }))}
                                                        inputProps={{ style: { fontSize: '13px', fontWeight: 500 } }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </AppFormModal>
    );
}