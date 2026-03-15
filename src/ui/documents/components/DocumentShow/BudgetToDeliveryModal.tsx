import { Box, MenuItem, CircularProgress, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, IconButton, InputAdornment } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity, DocumentLine } from '@/domain/entities/documents/DocumentEntity';
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
}

const numberSeriesRepository = new NumberSeriesRepositoryCrud();

export function BudgetToDeliveryModal({ open, onClose, document, onConvert, isConverting }: BudgetToDeliveryModalProps) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const [vatNumber, setVatNumber] = useState(document.partner_vat_number || '');
    const [cif, setCif] = useState(document.partner_cif || '');
    const [partnerType, setPartnerType] = useState('company');
    const [street, setStreet] = useState(document.partner_address || '');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    
    // Fulfillment state: map of source_line_id -> quantity to process
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

    const selectedStatusKey = 'draft';
    const targetType = document.document_type_code === 'QUO' ? 'DLV' : document.document_type_code === 'PQUO' ? 'PDLV' : 'DLV';

    const isProspect = document.partner_roles?.includes('prospect') || 
                      (document.operation === 'sale' && !document.partner_cif && !document.partner_vat_number);

    const { data: numberSeries, isLoading: isLoadingSeries } = useQuery({
        queryKey: ['number-series-for-conversion', document.company_id, targetType],
        queryFn: () => numberSeriesRepository.index(targetType),
        enabled: open,
    });

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

    const previewNumber = useMemo(() => {
        if (!selectedSeriesId || !numberSeries) return null;
        const series = numberSeries.find(ns => ns.id === selectedSeriesId);
        if (!series) return null;
        const nextNumber = series.current_number + 1;
        return `${series.serie}-${String(nextNumber).padStart(6, '0')}`;
    }, [selectedSeriesId, numberSeries]);

    const isTotalProcessZero = useMemo(() => {
        return Object.values(lineQuantities).reduce((acc, curr) => acc + curr, 0) <= 0;
    }, [lineQuantities]);

    const handleSave = () => {
        if (!selectedSeriesId) return;
        
        const linesPayload = Object.entries(lineQuantities)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({
                source_line_id: Number(id),
                quantity: qty
            }));

        const payload: any = { 
            number_series_id: selectedSeriesId, 
            status_key: selectedStatusKey,
            lines: linesPayload
        };

        if (document.operation === 'sale' || isProspect) {
            payload.partner_data = {
                vat_number: vatNumber,
                cif: cif,
                type: partnerType,
                address: {
                    street: street,
                    city: city,
                    state: state,
                    postal_code: postalCode,
                    country: 'España'
                }
            };
        }

        onConvert(payload);
    };

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title={`Convertir ${document.document_type_name} a Albarán`}
            onConfirm={handleSave}
            confirmText={isConverting ? "Procesando..." : "Generar Albarán"}
            isConfirmDisabled={!selectedSeriesId || isConverting || isTotalProcessZero}
            PaperProps={{
                sx: {
                    width: '800px',
                    maxWidth: '90vw'
                }
            }}
        >
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {isLoadingSeries ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} thickness={4} color="secondary" />
                    </Box>
                ) : (
                    <>
                        {/* SECCIÓN 1: SERIE Y PREVIEW */}
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                    Configuración del Destino
                                </Typography>
                                <TextField
                                    id="filled-basic"
                                    select
                                    fullWidth
                                    label="Serie de numeración (Albaranes)"
                                    variant="filled"
                                    value={selectedSeriesId}
                                    onChange={(e) => setSelectedSeriesId(Number(e.target.value) || '')}
                                    size="small"
                                    helperText="Seleccione la serie legal para el nuevo documento"
                                >
                                    <MenuItem value="" disabled><em>Seleccione serie...</em></MenuItem>
                                    {numberSeries?.map((ns) => (
                                        <MenuItem key={ns.id} value={ns.id}>
                                            Serie {ns.serie} (Contador: {ns.current_number})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                            {previewNumber && (
                                <Paper variant="outlined" sx={{ flex: 1, p: 1.5, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', fontSize: '9px' }}>Próximo número</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>{previewNumber}</Typography>
                                    </Box>
                                    <AddTask />
                                </Paper>
                            )}
                        </Box>

                        <Divider />

                        {/* SECCIÓN 2: GESTIÓN DE LÍNEAS (FULFILLMENT) */}
                        <Box>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                                Líneas a Procesar (Cantidades Parciales)
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Producto / Descripción</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Pendiente</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '180px' }}>A Procesar Ahora</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {document.lines.map((line) => {
                                            const pending = line.quantity - (line.processed_quantity || 0);
                                            const isFullyProcessed = pending <= 0;
                                            
                                            return (
                                                <TableRow key={line.id} sx={{ opacity: isFullyProcessed ? 0.5 : 1, bgcolor: isFullyProcessed ? 'action.hover' : 'inherit' }}>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{line.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{line.description || 'Sin descripción'}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: isFullyProcessed ? 'success.main' : 'text.primary' }}>
                                                            {pending.toFixed(2)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '10px' }}>
                                                            de {line.quantity}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {!isFullyProcessed ? (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                                <TextField
                                                                    type="number"
                                                                    size="small"
                                                                    variant="standard"
                                                                    value={lineQuantities[line.id!] || 0}
                                                                    onChange={(e) => handleQuantityChange(line.id!, e.target.value, pending)}
                                                                    inputProps={{ 
                                                                        min: 0, 
                                                                        max: pending, 
                                                                        step: "0.01",
                                                                        style: { textAlign: 'right', fontWeight: 800, color: '#1976d2' } 
                                                                    }}
                                                                    sx={{ width: '80px' }}
                                                                />
                                                                <IconButton size="small" onClick={() => resetQuantity(line.id!, pending)} title="Cargar máximo pendiente">
                                                                    <Replay fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>COMPLETADO</Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* SECCIÓN 3: FORMALIZACIÓN (SÓLO PROSPECTOS) */}
                        {isProspect && (
                            <>
                                <Divider />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 0, display: 'block' }}>
                                        Formalización del {document.operation === 'sale' ? 'Cliente' : 'Proveedor'}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            id="filled-basic"
                                            select
                                            fullWidth
                                            label="Tipo de Partner"
                                            variant="filled"
                                            size="small"
                                            value={partnerType}
                                            onChange={(e) => setPartnerType(e.target.value)}
                                            sx={{ flex: 1 }}
                                        >
                                            <MenuItem value="company">Empresa</MenuItem>
                                            <MenuItem value="person">Persona Física</MenuItem>
                                        </TextField>
                                        <TextField
                                            id="filled-basic"
                                            fullWidth
                                            label="CIF / NIF"
                                            variant="filled"
                                            size="small"
                                            value={cif}
                                            onChange={(e) => setCif(e.target.value)}
                                            placeholder="B12345678"
                                            sx={{ flex: 1 }}
                                        />
                                        <TextField
                                            id="filled-basic"
                                            fullWidth
                                            label="VAT"
                                            variant="filled"
                                            size="small"
                                            value={vatNumber}
                                            onChange={(e) => setVatNumber(e.target.value)}
                                            placeholder="ESB12345678"
                                            sx={{ flex: 1 }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField
                                            id="filled-basic"
                                            fullWidth
                                            label="Dirección (Calle, Número...)"
                                            variant="filled"
                                            size="small"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                        />
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField
                                                id="filled-basic"
                                                fullWidth
                                                label="Ciudad"
                                                variant="filled"
                                                size="small"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            />
                                            <TextField
                                                id="filled-basic"
                                                fullWidth
                                                label="Provincia"
                                                variant="filled"
                                                size="small"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                            />
                                            <TextField
                                                id="filled-basic"
                                                fullWidth
                                                label="Código Postal"
                                                variant="filled"
                                                size="small"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </>
                )}
            </Box>
        </AppFormModal>
    );
}
