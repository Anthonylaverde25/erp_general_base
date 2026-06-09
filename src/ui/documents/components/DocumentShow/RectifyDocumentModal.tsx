// import { Box, MenuItem, CircularProgress, TextField, Typography, Paper, Alert, AlertTitle } from '@mui/material';
// import { useQuery } from '@tanstack/react-query';
// import { useState, useMemo, useEffect } from 'react';
// import { AppFormModal } from '@/components/modals/AppFormModal';
// import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
// import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
// import { FileText, AlertTriangle } from 'lucide-react';

// interface RectifyDocumentModalProps {
//     open: boolean;
//     onClose: () => void;
//     document: DocumentEntity;
//     onRectify: (payload: { 
//         number_series_id: number; 
//         reason?: string;
//     }) => void;
//     isRectifying: boolean;
// }

// const numberSeriesRepository = new NumberSeriesRepositoryCrud();

// export function RectifyDocumentModal({ 
//     open, 
//     onClose, 
//     document, 
//     onRectify, 
//     isRectifying 
// }: RectifyDocumentModalProps) {
//     const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
//     const [reason, setReason] = useState('');

//     useEffect(() => {
//         if (open) {
//             setSelectedSeriesId('');
//             setReason('');
//         }
//     }, [open]);

//     // Credit Note / Factura Rectificativa type is CRN
//     const targetType = 'CRN';

//     const { data: numberSeries, isLoading: isLoadingSeries } = useQuery({
//         queryKey: ['number-series-for-rectification', document.company_id, targetType],
//         queryFn: () => numberSeriesRepository.index(targetType),
//         enabled: open,
//     });

//     const previewNumber = useMemo(() => {
//         if (!selectedSeriesId || !numberSeries) return null;
//         const series = numberSeries.find(ns => ns.id === selectedSeriesId);
//         if (!series) return null;
//         const nextNumber = series.current_number + 1;
//         return `${series.serie}-${series.year}-${String(nextNumber).padStart(6, '0')}`;
//     }, [selectedSeriesId, numberSeries]);

//     const handleConfirm = () => {
//         if (!selectedSeriesId) return;

//         onRectify({ 
//             number_series_id: selectedSeriesId, 
//             reason: reason.trim() || undefined
//         });
//     };

//     return (
//         <AppFormModal
//             isOpen={open}
//             onClose={onClose}
//             title={
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                     <Box sx={{ 
//                         width: 32, 
//                         height: 32, 
//                         borderRadius: '6px', 
//                         bgcolor: 'error.50', 
//                         color: 'error.700', 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         justifyContent: 'center' 
//                     }}>
//                         <AlertTriangle size={18} />
//                     </Box>
//                     <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'error.700' }}>
//                         Rectificar Factura de Venta
//                     </Typography>
//                 </Box>
//             }
//             onConfirm={handleConfirm}
//             confirmText={isRectifying ? "Procesando..." : "Confirmar Anulación"}
//             isConfirmDisabled={!selectedSeriesId || isRectifying}
//             PaperProps={{ 
//                 sx: { 
//                     width: '450px', 
//                     maxWidth: '95vw',
//                     borderRadius: '4px',
//                     bgcolor: '#ffffff',
//                     boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
//                     overflow: 'hidden'
//                 } 
//             }}
//         >
//             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                 <Box sx={{
//                     px: 3,
//                     py: 2,
//                     bgcolor: '#fdf2f2',
//                     borderBottom: '1px solid #fde8e8',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Box>
//                             <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9b1c1c' }}>
//                                 Documento a Anular
//                             </Typography>
//                             <Typography variant="caption" sx={{ color: '#c81e1e', fontWeight: 600 }}>
//                                 {document.number_serie} • {document.partner_name}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </Box>

//                 {isLoadingSeries ? (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
//                         <CircularProgress size={28} thickness={4} color="error" />
//                     </Box>
//                 ) : (
//                     <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
//                         <Alert severity="warning" variant="outlined" sx={{ borderRadius: '4px', borderStyle: 'solid' }}>
//                             <AlertTitle sx={{ fontWeight: 700 }}>Atención Fiscal e Impositiva</AlertTitle>
//                             Esta acción registrará una <strong>Factura Rectificativa (CRN)</strong> que anulará el cargo original. La factura de origen ({document.number_serie}) cambiará de estado a <strong>Anulada / Cancelada</strong>.
//                         </Alert>

//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                             <Box sx={{ width: '100%' }}>
//                                 <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
//                                     Serie de Numeración Rectificativa (CRN)
//                                 </Typography>
//                                 <TextField
//                                     select
//                                     fullWidth
//                                     variant="filled"
//                                     label="Seleccione serie legal"
//                                     value={selectedSeriesId}
//                                     onChange={(e) => setSelectedSeriesId(Number(e.target.value) || '')}
//                                     size="small"
//                                     sx={{ 
//                                         '& .MuiInputBase-input': { fontSize: '13px', fontWeight: 600 }
//                                     }}
//                                 >
//                                     <MenuItem value="" disabled><em className="text-gray-400">Seleccione la serie de numeración...</em></MenuItem>
//                                     {numberSeries?.map((ns) => (
//                                         <MenuItem key={ns.id} value={ns.id} sx={{ fontSize: '13px' }}>
//                                             Serie {ns.serie} (Próximo: {ns.current_number + 1})
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Box>

//                             <Box sx={{ width: '100%' }}>
//                                 <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
//                                     Motivo de la Rectificación (Opcional)
//                                 </Typography>
//                                 <TextField
//                                     fullWidth
//                                     variant="filled"
//                                     label="Describa el motivo..."
//                                     multiline
//                                     rows={2}
//                                     value={reason}
//                                     onChange={(e) => setReason(e.target.value)}
//                                     size="small"
//                                     inputProps={{ style: { fontSize: '13px', fontWeight: 500 } }}
//                                 />
//                             </Box>

//                             {previewNumber && (
//                                 <Box sx={{
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     alignItems: 'flex-start',
//                                     width: '100%',
//                                     mt: 1,
//                                     px: 2,
//                                     py: 1.5,
//                                     bgcolor: '#fdf2f2',
//                                     border: '1px solid #fde8e8',
//                                     borderLeft: '4px solid #c81e1e',
//                                     borderRadius: '4px'
//                                 }}>
//                                     <Typography variant="caption" sx={{ fontWeight: 800, color: '#c81e1e', textTransform: 'uppercase', fontSize: '10px', mb: 0.5, letterSpacing: '0.5px' }}>
//                                         Nº Rectificativa a Generar
//                                     </Typography>
//                                     <Typography variant="body1" sx={{ fontWeight: 900, color: '#9b1c1c', letterSpacing: '1px', fontSize: '16px' }}>
//                                         {previewNumber}
//                                     </Typography>
//                                 </Box>
//                             )}
//                         </Box>
//                     </Box>
//                 )}
//             </Box>
//         </AppFormModal>
//     );
// }


import { Box, MenuItem, CircularProgress, TextField, Typography, Alert, AlertTitle } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
import { AlertTriangle } from 'lucide-react';
import axiosInstance from '@/lib/@axios';

// 1. Definición del Esquema de Validación con Zod
const rectifySchema = z.object({
    number_series_id: z.number({ required_error: 'Debe seleccionar una serie' }),
    reason_id: z.number({ required_error: 'Debe seleccionar un motivo' }),
    notes: z.string().optional(),
});

export type RectifyFormValues = z.infer<typeof rectifySchema>;

// 2. Valores Duros para los Motivos (Mapeados a tu Seeder)
const HARDCODED_REASONS = [
    { id: 1, label: 'Error en montos o precios unitarios' },
    { id: 2, label: 'Datos del cliente incorrectos (RUT/DNI)' },
    { id: 3, label: 'Documento emitido por duplicado' },
    { id: 4, label: 'Rechazo directo por parte del cliente' },
    { id: 5, label: 'Error de sistema / Falla técnica' },
    { id: 6, label: 'Otros (Especificar en notas)' },
];

interface RectifyDocumentModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
    onRectify: (payload: RectifyFormValues) => void;
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

  const [reasons, setReasons] = useState<{id:number, country_code: string, reason:string, is_active: boolean}[]>([]);
  useEffect(()=> {
    try {
      const fetchReason = async () => {
        const {data: {reasons}} = await axiosInstance.get('/cancelation-reasons')
        setReasons(reasons)
      }
      fetchReason()
    } catch (error) {
      throw error
    }
  },[])
    
    // 3. Configuración de React Hook Form
    const { 
        control, 
        handleSubmit, 
        watch, 
        reset, 
        formState: { errors, isValid } 
    } = useForm<RectifyFormValues>({
        resolver: zodResolver(rectifySchema),
        mode: 'onChange', // Valida en tiempo real mientras el usuario interactúa
        defaultValues: {
            notes: '',
        }
    });

    // Resetear el formulario cuando se abre el modal
    useEffect(() => {
        if (open) reset();
    }, [open, reset]);

    const targetType = 'CRN';

    const { data: numberSeries, isLoading: isLoadingSeries } = useQuery({
        queryKey: ['number-series-for-rectification', document.company_id, targetType],
        queryFn: () => numberSeriesRepository.index(targetType),
        enabled: open,
    });

    // Observar el valor de la serie para generar la vista previa
    const watchedSeriesId = watch('number_series_id');

    const previewNumber = useMemo(() => {
        if (!watchedSeriesId || !numberSeries) return null;
        const series = numberSeries.find(ns => ns.id === watchedSeriesId);
        if (!series) return null;
        const nextNumber = series.current_number + 1;
        return `${series.serie}-${series.year}-${String(nextNumber).padStart(6, '0')}`;
    }, [watchedSeriesId, numberSeries]);

    // Función que RHF ejecutará solo si el esquema es válido
    const onSubmit = (data: RectifyFormValues) => {
        onRectify(data);
    };

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
            // Enlazamos el botón de confirmación del modal con el handleSubmit de RHF
            onConfirm={handleSubmit(onSubmit)}
            confirmText={isRectifying ? "Procesando..." : "Confirmar Anulación"}
            // Deshabilitamos si el formulario es inválido o está procesando
            isConfirmDisabled={!isValid || isRectifying}
            PaperProps={{ 
                sx: { 
                    width: '450px', maxWidth: '95vw', borderRadius: '4px',
                    bgcolor: '#ffffff', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
                    overflow: 'hidden'
                } 
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2, bgcolor: '#fdf2f2', borderBottom: '1px solid #fde8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                            
                            {/* Controller para Series de Numeración */}
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
                                    Serie Rectificativa (CRN) *
                                </Typography>
                                <Controller
                                    name="number_series_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            variant="filled"
                                            label="Seleccione serie legal"
                                            size="small"
                                            error={!!errors.number_series_id}
                                            helperText={errors.number_series_id?.message}
                                            sx={{ '& .MuiInputBase-input': { fontSize: '13px', fontWeight: 600 } }}
                                        >
                                            {numberSeries?.map((ns) => (
                                                <MenuItem key={ns.id} value={ns.id} sx={{ fontSize: '13px' }}>
                                                    Serie {ns.serie} (Próximo: {ns.current_number + 1})
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Box>

                            {/* Controller para Motivo de Anulación */}
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
                                    Motivo de Anulación *
                                </Typography>
                                <Controller
                                    name="reason_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            variant="filled"
                                            label="Seleccione el motivo principal"
                                            size="small"
                                            error={!!errors.reason_id}
                                            helperText={errors.reason_id?.message}
                                            sx={{ '& .MuiInputBase-input': { fontSize: '13px', fontWeight: 600 } }}
                                        >
                                            {reasons?.map((reason) => (
                                                <MenuItem key={reason.id} value={reason.id} sx={{ fontSize: '13px' }}>
                                                    {reason.reason}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Box>

                            {/* Controller para Notas / Observaciones */}
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.5px' }}>
                                    Notas Adicionales (Opcional)
                                </Typography>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            variant="filled"
                                            label="Describa detalles adicionales..."
                                            multiline
                                            rows={2}
                                            size="small"
                                            error={!!errors.notes}
                                            helperText={errors.notes?.message}
                                            inputProps={{ style: { fontSize: '13px', fontWeight: 500 } }}
                                        />
                                    )}
                                />
                            </Box>

                            {previewNumber && (
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                    width: '100%', mt: 1, px: 2, py: 1.5,
                                    bgcolor: '#fdf2f2', border: '1px solid #fde8e8',
                                    borderLeft: '4px solid #c81e1e', borderRadius: '4px'
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