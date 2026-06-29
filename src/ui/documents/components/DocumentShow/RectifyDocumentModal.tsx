import { useState, useEffect, useMemo } from 'react';
import { Box, MenuItem, CircularProgress, TextField, Typography, Button, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle, Save, FileText } from 'lucide-react';

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
const inputSx = { 
    '& .MuiInputBase-input': { fontSize: '13px', fontWeight: 600 },
    '& .MuiFilledInput-root': { borderRadius: 0 },
    '& .MuiOutlinedInput-root': { borderRadius: 0 }
};

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
        setValue,
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

    // Smart Default: Si solo hay una serie rectificativa disponible, seleccionarla automáticamente
    useEffect(() => {
        if (numberSeries && numberSeries.length === 1) {
            setValue('number_series_id', numberSeries[0].id, { shouldValidate: true });
        }
    }, [numberSeries, setValue]);

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

    // UX: Copia masiva del primer comentario al resto en la misma línea
    const handleApplyCommentToAll = (line: any, firstSn: string) => {
        const commentToCopy = serialComments[firstSn] || '';
        const updatedComments = { ...serialComments };
        line.meta.serial_numbers.forEach((sn: string) => {
            updatedComments[sn] = commentToCopy;
        });
        setSerialComments(updatedComments);
    };

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AlertTriangle size={20} style={{ color: '#dc2626' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 750, fontSize: '1.15rem', color: '#dc2626' }}>
                        Rectificar Factura de Venta
                    </Typography>
                </Box>
            }
            actions={
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', width: '100%' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={onClose}
                        disabled={isRectifying}
                        sx={{
                            borderRadius: 0,
                            bgcolor: '#ffffff',
                            color: '#374151',
                            borderColor: '#d1d5db',
                            px: 3,
                            py: 0.75,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            '&:hover': {
                                bgcolor: '#f9fafb',
                                borderColor: '#c5c9d1'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleSubmit((values) => onRectify({ ...values, serial_comments: serialComments }))}
                        disabled={!isValid || isRectifying}
                        sx={{
                            borderRadius: 0,
                            bgcolor: '#000000',
                            color: '#ffffff',
                            px: 3,
                            py: 0.75,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            '&:hover': {
                                bgcolor: '#1f2937'
                            }
                        }}
                        startIcon={isRectifying ? <CircularProgress size={14} color="inherit" /> : <Save size={14} />}
                    >
                        {isRectifying ? "Procesando..." : "Confirmar Anulación"}
                    </Button>
                </Box>
            }
            actionsSx={{
                bgcolor: '#f3f4f6',
                borderTop: '1px solid',
                borderColor: '#e5e7eb',
                p: 3
            }}
            maxWidth={hasSerializedItems ? "md" : "sm"}
            PaperProps={{
                sx: {
                    width: hasSerializedItems ? '850px' : '450px', maxWidth: '95vw', borderRadius: 0,
                    bgcolor: '#ffffff', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* Encabezado Optimizado */}
                <Box sx={{ px: 3, py: 2, bgcolor: '#fdf2f2', borderBottom: '1px solid #fde8e8', borderLeft: '4px solid #c81e1e', borderRadius: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9b1c1c' }}>
                        Documento a Anular
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#7f1d1d', lineHeight: 1.4 }}>
                        Se emitirá una <strong>Factura Rectificativa (CRN)</strong> para anular el cargo. El documento de origen pasará a estado <strong>Anulado</strong> y las unidades serializadas devueltas retornarán al inventario disponible.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 700 }}>
                            <span style={{ fontWeight: 500, color: '#991b1b' }}>Nº Origen:</span> {document.number_serie}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 700 }}>
                            <span style={{ fontWeight: 500, color: '#991b1b' }}>Cliente:</span> {document.partner_name}
                        </Typography>
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
                                
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '1px', mb: -0.5 }}>
                                    1. Datos Fiscales y Serie Legal
                                </Typography>

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

                                <Divider sx={{ my: 0.5 }} />

                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '1px', mb: -0.5 }}>
                                    2. Justificación y Motivos
                                </Typography>

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
                                    <Typography variant="caption" sx={labelSx}>Notas Adicionales (Opcional)</Typography>
                                    <Controller
                                        name="notes"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} fullWidth variant="filled" label="Describa detalles adicionales..." multiline rows={2} size="small" error={!!errors.notes} helperText={errors.notes?.message} InputProps={{ sx: { borderRadius: 0 } }} inputProps={{ style: { fontSize: '13px', fontWeight: 500 } }} />
                                        )}
                                    />
                                </Box>

                                {previewNumber && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2, 
                                        width: '100%', 
                                        mt: 1.5, 
                                        px: 2, 
                                        py: 1.5, 
                                        bgcolor: '#f8fafc', 
                                        border: '1px solid #e2e8f0', 
                                        borderLeft: '4px solid #475569', 
                                        borderRadius: 0 
                                    }}>
                                        <FileText size={20} style={{ color: '#475569' }} />
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '9px', mb: 0.2, letterSpacing: '0.5px', display: 'block' }}>
                                                Nº Rectificativa a Generar (Borrador)
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 750, fontFamily: 'monospace', color: '#0f172a', letterSpacing: '0.5px' }}>
                                                {previewNumber}
                                            </Typography>
                                        </Box>
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
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1 }}>
                                    Ingrese comentarios individuales para cada número de serie devuelto.
                                </Typography>

                                {serializedLines.map((line, lineIdx) => (
                                    <Box key={line.id || lineIdx} sx={{ mb: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ px: 1, py: 0.25, bgcolor: '#e5e7eb', color: '#374151', borderRadius: 0, fontSize: '10px', fontWeight: 700, fontFamily: 'monospace' }}>
                                                    {line.item_code || 'PROD'}
                                                </Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>
                                                    {line.name}
                                                </Typography>
                                            </Box>
                                            {line.meta?.serial_numbers?.length > 1 && (
                                                <Button 
                                                    size="small" 
                                                    variant="text" 
                                                    onClick={() => handleApplyCommentToAll(line, line.meta.serial_numbers[0])}
                                                    sx={{ 
                                                        fontSize: '11px', 
                                                        textTransform: 'none', 
                                                        color: '#005483', 
                                                        p: 0,
                                                        minWidth: 0,
                                                        fontWeight: 700,
                                                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                                    }}
                                                >
                                                    Copiar primer comentario al resto
                                                </Button>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 0.5 }}>
                                            {line.meta?.serial_numbers?.map((sn) => (
                                                <Box key={sn} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>
                                                        Nº Serie: <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{sn}</span>
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        placeholder="Escribir motivo de la devolución..."
                                                        size="small"
                                                        value={serialComments[sn] || ''}
                                                        onChange={(e) => setSerialComments(prev => ({ ...prev, [sn]: e.target.value }))}
                                                        InputProps={{ sx: { borderRadius: 0 } }}
                                                        inputProps={{ style: { fontSize: '13px', fontWeight: 500 } }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                        {lineIdx < serializedLines.length - 1 && <Divider sx={{ mt: 1 }} />}
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