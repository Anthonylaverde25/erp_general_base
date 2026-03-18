import { Box, MenuItem, CircularProgress, TextField, Typography, Paper, Divider, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { NumberSeriesRepositoryCrud } from '@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud';
import { AddTask, Replay } from '@mui/icons-material';

interface BudgetToDeliveryModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
    onConvert: (payload: { 
        number_series_id: number; 
        status_key: string;
        lines?: { source_line_id: number; quantity: number }[];
        partner_data?: { 
            vat_number: string; 
            cif: string;
            type: string;
            address: {
                street: string;
                city: string;
                state: string;
                postal_code: string;
                country: string;
            }
        }
    }) => void;
    isConverting: boolean;
    mode: 'full' | 'partial';
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

export function BudgetToDeliveryModal({ open, onClose, document, onConvert, isConverting, mode }: BudgetToDeliveryModalProps) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const [vatNumber, setVatNumber] = useState(document.partner_vat_number || '');
    const [cif, setCif] = useState(document.partner_cif || '');
    const [partnerType, setPartnerType] = useState('company');
    const [street, setStreet] = useState(document.partner_address || '');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    
    const [lineQuantities, setLineQuantities] = useState<Record<number, number>>({});

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

    const targetType = document.document_type_code === 'QUO' ? 'DLV' : document.document_type_code === 'PQUO' ? 'PDLV' : 'DLV';
    const isProspect = document.partner_roles?.includes('prospect') || 
                      (document.operation === 'sale' && !document.partner_cif && !document.partner_vat_number);

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

        const payload: any = { 
            number_series_id: selectedSeriesId, 
            status_key: 'draft',
            lines: linesPayload
        };

        if (document.operation === 'sale' || isProspect) {
            payload.partner_data = {
                vat_number: vatNumber,
                cif: cif,
                type: partnerType,
                address: { street, city, state, postal_code: postalCode, country: 'España' }
            };
        }
        onConvert(payload);
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
                        {mode === 'full' ? 'Conversión Directa' : 'Procesar Líneas de Presupuesto'}
                    </Typography>
                </Box>
            }
            onConfirm={handleSave}
            confirmText={isConverting ? "Procesando..." : "Generar Albarán"}
            isConfirmDisabled={!selectedSeriesId || isConverting || isTotalProcessZero}
            PaperProps={{ 
                sx: { 
                    width: '750px', 
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
                        {/* 1. Header Section: Configuración de Serie */}
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
                                            Nº Próximo Albarán
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AddTask sx={{ fontSize: '16px', color: 'indigo.600' }} />
                                            <Typography variant="body1" sx={{ fontWeight: 800, color: 'indigo.900', letterSpacing: '1px', fontSize: '16px' }}>
                                                {previewNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* 2. Main Content Section */}
                        <Box sx={{ p: 3 }}>
                            {/* 2.1 Formalization Section (Prospects) - NOW AT TOP */}
                            {isProspect && (
                                <Box sx={{ mb: mode === 'partial' ? 4 : 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Formalización de {document.operation === 'sale' ? 'Cliente' : 'Proveedor'}
                                        </Typography>
                                        <Box sx={{ px: 1, py: 0.25, bgcolor: 'indigo.50', color: 'indigo.700', borderRadius: '4px', fontSize: '9px', fontWeight: 900 }}>REQUERIDO</Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                                        <TextField id="filled-basic" select fullWidth label="Tipo" variant="filled" size="small" value={partnerType} onChange={(e) => setPartnerType(e.target.value)}>
                                            <MenuItem value="person">Persona Física</MenuItem>
                                            <MenuItem value="company">Empresa / Entidad</MenuItem>
                                        </TextField>
                                        <TextField id="filled-basic" fullWidth label="CIF / NIF" variant="filled" size="small" value={cif} onChange={(e) => setCif(e.target.value)} />
                                        <TextField id="filled-basic" fullWidth label="VAT ID" variant="filled" size="small" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} />
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField id="filled-basic" fullWidth label="Dirección Fiscal" variant="filled" size="small" value={street} onChange={(e) => setStreet(e.target.value)} />
                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 2 }}>
                                            <TextField id="filled-basic" fullWidth label="Ciudad" variant="filled" size="small" value={city} onChange={(e) => setCity(e.target.value)} />
                                            <TextField id="filled-basic" fullWidth label="Provincia" variant="filled" size="small" value={state} onChange={(e) => setState(e.target.value)} />
                                            <TextField id="filled-basic" fullWidth label="C.P." variant="filled" size="small" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                                        </Box>
                                    </Box>
                                    {mode === 'partial' && <Divider sx={{ mt: 4 }} />}
                                </Box>
                            )}

                            {/* 2.2 Table Section (Partial Mode) */}
                            {mode === 'partial' && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Detalle de Líneas de Presupuesto
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Cantidades a procesar en este albarán.
                                        </Typography>
                                    </Box>
                                    
                                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid', borderColor: 'grey.200' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                                    <TableCell sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200' }}>Producto / Descripción</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200', width: '110px' }}>Estado</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200', width: '80px' }}>Pend.</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 800, py: 1.5, fontSize: '11px', textTransform: 'uppercase', color: 'text.secondary', borderBottom: '1px solid', borderColor: 'grey.200', width: '160px' }}>A Procesar</TableCell>
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
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDone ? 'text.disabled' : 'text.primary', fontSize: '13px' }}>
                                                                        {line.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                                                                        {line.description || 'Sin descripción adicional'}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box sx={{ 
                                                                    display: 'inline-flex', 
                                                                    px: 1, 
                                                                    py: 0.25, 
                                                                    borderRadius: '4px', 
                                                                    fontSize: '10px', 
                                                                    fontWeight: 800,
                                                                    bgcolor: isDone ? 'success.50' : 'info.50',
                                                                    color: isDone ? 'success.700' : 'info.700',
                                                                    border: '1px solid',
                                                                    borderColor: isDone ? 'success.100' : 'info.100'
                                                                }}>
                                                                    {isDone ? 'PROCESADO' : 'PENDIENTE'}
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
                                                                                min: 0, 
                                                                                max: pending, 
                                                                                step: "0.01",
                                                                                style: { textAlign: 'right', fontWeight: 700, fontSize: '13px', paddingTop: '8px' } 
                                                                            }}
                                                                            sx={{ width: '100px', '& .MuiFilledInput-root': { height: '40px' } }}
                                                                        />
                                                                        <IconButton 
                                                                            size="small" 
                                                                            onClick={() => resetQuantity(line.id!, pending)} 
                                                                            sx={{ 
                                                                                borderRadius: '4px', 
                                                                                bgcolor: 'grey.100',
                                                                                color: 'grey.600',
                                                                                '&:hover': { bgcolor: 'indigo.600', color: 'white' }
                                                                            }}
                                                                            title="Cargar máximo"
                                                                        >
                                                                            <Replay sx={{ fontSize: '16px' }} />
                                                                        </IconButton>
                                                                    </Box>
                                                                ) : (
                                                                    <CheckCircle className="text-emerald-500" size={20} />
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
