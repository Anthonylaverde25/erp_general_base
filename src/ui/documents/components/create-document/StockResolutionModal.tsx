import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    Box,
    Typography,
    Alert,
    AlertTitle,
    CircularProgress,
} from '@mui/material';
import { useDocumentCreate } from '../../context/DocumentCreateContext';
import type { DocumentFormValues } from '../../schemas/documentSchema';
import axiosInstance from '@/lib/@axios';

interface StockResolutionModalProps {
    open: boolean;
    onClose: () => void;
}

export default function StockResolutionModal({ open, onClose }: StockResolutionModalProps) {
    const { stockConflicts, setStockConflicts, onSubmitIssue, setLineStockWarnings } = useDocumentCreate();
    const { getValues } = useFormContext<DocumentFormValues>();

    // Local state to store chosen store IDs mapped by line index
    const [resolutions, setResolutions] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Reset and initialize resolutions when modal opens
    React.useEffect(() => {
        if (open && stockConflicts) {
            const initialResolutions: Record<number, number> = {};
            stockConflicts.forEach((conflict: any) => {
                const available = Math.max(0, conflict.available_stock);
                const deficit = conflict.requested_quantity - available;
                
                // Pre-select the first store that has enough stock to cover the deficit
                const autoSelectStore = conflict.alternative_stores.find(
                    (store: any) => store.available_stock >= deficit
                ) || conflict.alternative_stores[0];
                
                if (autoSelectStore) {
                    initialResolutions[conflict.line_index] = autoSelectStore.store_id;
                }
            });
            setResolutions(initialResolutions);
            setErrorMessage(null);
            setIsLoading(false);
        }
    }, [open, stockConflicts]);

    if (!stockConflicts || stockConflicts.length === 0) {
        return null;
    }

    const handleStoreChange = (lineIndex: number, storeId: number) => {
        setResolutions((prev) => ({
            ...prev,
            [lineIndex]: storeId,
        }));
    };

    const handleConfirmAndRetry = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            // Process all transfers in parallel
            await Promise.all(
                stockConflicts.map(async (conflict) => {
                    const available = Math.max(0, conflict.available_stock);
                    const deficit = conflict.requested_quantity - available;
                    const sourceStoreId = resolutions[conflict.line_index];

                    if (!sourceStoreId) {
                        throw new Error(`Por favor, seleccione un almacén de origen para ${conflict.item_name}.`);
                    }

                    // Call backend to register the stock transfer movement
                    await axiosInstance.post('/stock-movements', {
                        item_id: conflict.item_id,
                        source_store_id: sourceStoreId,
                        destination_store_id: conflict.store_id, // Target is the original line store
                        quantity: deficit,
                        type: 'transfer',
                        reason: 'Replenishment for sale',
                        reference: 'Auto-Replenish',
                        notes: `Transferencia automática para cubrir faltante de ${deficit} unidades de ${conflict.item_name}.`
                    });
                })
            );

            // Update line warnings to be marked as resolved
            setLineStockWarnings(prev => {
                const updated = { ...prev };
                stockConflicts.forEach(conflict => {
                    let targetLineId = conflict.line_id;
                    if (!targetLineId) {
                        const lines = getValues("lines");
                        targetLineId = lines[conflict.line_index]?.id;
                    }

                    if (targetLineId && updated[targetLineId]) {
                        updated[targetLineId] = {
                            ...updated[targetLineId],
                            is_resolved: true,
                            is_insufficient: false,
                        };
                    }
                });
                return updated;
            });

            // Check if any of the conflicts was a single-line inline resolution
            const isSingleLine = stockConflicts.some(c => c.is_single_line_resolution);

            // Clean conflicts and close
            setStockConflicts(null);
            onClose();

            if (!isSingleLine) {
                // Re-submit the document after stock is replenished
                setTimeout(() => {
                    onSubmitIssue();
                }, 100);
            }
        } catch (error: any) {
            console.error("Stock transfer failed:", error);
            const msg = error.response?.data?.message || error.message || "Error al realizar la transferencia de stock.";
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isLoading ? undefined : onClose}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 550,
                    borderRadius: '4px', // Sharp Edges: as per erpViteReact/AGENTS.md
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', py: 2 }}>
                Resolución de Stock Insuficiente
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                {errorMessage && (
                    <Box mb={2.5}>
                        <Alert severity="error" variant="filled" sx={{ borderRadius: '4px' }}>
                            <AlertTitle sx={{ fontSize: '13px', fontWeight: 700, m: 0 }}>Error en la Transferencia</AlertTitle>
                            {errorMessage}
                        </Alert>
                    </Box>
                )}

                <DialogContentText sx={{ fontSize: '13px', mb: 2 }}>
                    El stock disponible en el almacén de destino no cubre la cantidad solicitada. Seleccione de qué almacén alternativo transferir la mercadería faltante para completar la venta:
                </DialogContentText>

                <Box display="flex" flexDirection="column" gap={3}>
                    {stockConflicts.map((conflict: any, i: number) => {
                        const available = Math.max(0, conflict.available_stock);
                        const deficit = conflict.requested_quantity - available;
                        const selectedStoreId = resolutions[conflict.line_index] ?? '';

                        return (
                            <Box
                                key={i}
                                p={2}
                                border="1px solid #e2e8f0"
                                borderLeft="4px solid #005483" // Premium visual contrast left border
                                borderRadius="4px" // sharp edges
                                bgcolor="#ffffff"
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                                    Línea {conflict.line_index + 1}: {conflict.item_name}
                                </Typography>

                                <Box display="flex" flexDirection="column" gap={0.5} mb={2} fontSize="12px" color="text.secondary">
                                    <Box display="flex" justifyContent="space-between">
                                        <span>Cantidad Solicitada:</span>
                                        <strong>{conflict.requested_quantity} uds.</strong>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <span>Disponible en {conflict.store_name}:</span>
                                        <strong style={{ color: available > 0 ? '#475569' : '#e11d48' }}>{available} uds.</strong>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" sx={{ borderTop: '1px dashed #e2e8f0', pt: 0.5, mt: 0.5 }}>
                                        <span style={{ color: '#005483', fontWeight: 600 }}>Faltante a Transferir:</span>
                                        <strong style={{ color: '#005483' }}>{deficit} uds.</strong>
                                    </Box>
                                </Box>

                                <FormControl fullWidth size="small" disabled={isLoading}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5 }}>
                                        Almacén Alternativo de Origen (para transferir {deficit} uds.):
                                    </Typography>
                                    <Select
                                        value={selectedStoreId}
                                        onChange={(e) => handleStoreChange(conflict.line_index, Number(e.target.value))}
                                        sx={{ fontSize: '13px', borderRadius: '4px' }}
                                    >
                                        <MenuItem value="" disabled>
                                            Seleccione almacén alternativo...
                                        </MenuItem>
                                        {conflict.alternative_stores.map((store: any) => (
                                            <MenuItem key={store.store_id} value={store.store_id} sx={{ fontSize: '13px' }}>
                                                {store.name} ({store.available_stock} uds. disponibles) {store.available_stock >= deficit ? ' [✓ Suficiente]' : ''}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {(() => {
                                    if (!selectedStoreId) return null;
                                    const selectedStore = conflict.alternative_stores.find((s: any) => s.store_id === selectedStoreId);
                                    const isInsufficient = selectedStore ? selectedStore.available_stock < deficit : true;

                                    if (isInsufficient) {
                                        return (
                                            <Box mt={2}>
                                                <Alert severity="warning" variant="outlined" sx={{ py: 0.5, px: 1.5, fontSize: '12px', borderRadius: '4px' }}>
                                                    <AlertTitle sx={{ fontSize: '13px', fontWeight: 700, m: 0 }}>Stock de Origen Insuficiente</AlertTitle>
                                                    El almacén elegido solo dispone de <strong>{selectedStore?.available_stock ?? 0} uds.</strong>, lo cual no cubre el faltante de <strong>{deficit} uds.</strong>
                                                </Alert>
                                            </Box>
                                        );
                                    }
                                    return (
                                        <Box mt={1.5} sx={{ borderLeft: '3px solid #16a34a', pl: 1.5, py: 0.5, bgcolor: '#f0fdf4' }}>
                                            <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600, display: 'block' }}>
                                                Confirmación de transferencia logística:
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Se trasladarán <strong>{deficit} unidades</strong> de {selectedStore?.name} a {conflict.store_name} antes de facturar.
                                            </Typography>
                                        </Box>
                                    );
                                })()}
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, gap: 1, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    disabled={isLoading}
                    sx={{ textTransform: 'none', px: 3, fontSize: '13px', borderRadius: '4px' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirmAndRetry}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '4px',
                        bgcolor: '#005483',
                        '&:hover': {
                            bgcolor: '#004066',
                        }
                    }}
                >
                    {isLoading ? 'Confirmando...' : 'Confirmar y Reintentar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
