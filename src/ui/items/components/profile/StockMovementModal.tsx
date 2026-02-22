import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import { Inventory2 } from '@mui/icons-material';
import { useRegisterStockMovement } from '@/features/items/hooks/useRegisterStockMovement';
import useIndexStores from '@/features/stores/hooks/useIndexStores';

interface StockMovementModalProps {
    open: boolean;
    onClose: () => void;
    itemId: number;
    itemName: string;
}

const REASONS = [
    { value: 'adjustment', label: 'Ajuste de inventario' },
    { value: 'purchase', label: 'Compra' },
    { value: 'return', label: 'Devolución' },
    { value: 'production', label: 'Producción' },
    { value: 'other', label: 'Otro' },
];

export default function StockMovementModal({ open, onClose, itemId, itemName }: StockMovementModalProps) {
    const { handleRegisterStockMovement, isLoading } = useRegisterStockMovement();
    const { stores, isLoading: storesLoading } = useIndexStores();

    const [quantity, setQuantity] = useState<string>('');
    const [storeId, setStoreId] = useState<string>('');
    const [reason, setReason] = useState<string>('adjustment');
    const [notes, setNotes] = useState<string>('');

    const handleSubmit = async () => {
        if (!quantity || !storeId) return;

        await handleRegisterStockMovement({
            item_id: itemId,
            source_store_id: null,
            destination_store_id: Number(storeId),
            quantity: Number(quantity),
            type: 'entry',
            reason,
            reference: null,
            notes: notes || null,
        });

        handleClose();
    };

    const handleClose = () => {
        setQuantity('');
        setStoreId('');
        setReason('adjustment');
        setNotes('');
        onClose();
    };

    const isValid = Number(quantity) > 0 && storeId;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pb: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Inventory2 sx={{ color: 'primary.main', fontSize: 22 }} />
                <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Agregar Stock
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {itemName}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 2.5, pb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        select
                        label="Almacén"
                        size="small"
                        fullWidth
                        value={storeId}
                        onChange={(e) => setStoreId(e.target.value)}
                        disabled={storesLoading}
                    >
                        {stores?.map((store) => (
                            <MenuItem key={store.id} value={store.id}>
                                {store.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Cantidad"
                        type="number"
                        size="small"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        inputProps={{ min: 0.0001, step: 1 }}
                    />

                    <TextField
                        select
                        label="Motivo"
                        size="small"
                        fullWidth
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        {REASONS.map((r) => (
                            <MenuItem key={r.value} value={r.value}>
                                {r.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Observaciones"
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Opcional: describe el motivo del ajuste..."
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                    onClick={handleClose}
                    size="small"
                    color="inherit"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    size="small"
                    variant="contained"
                    disabled={!isValid || isLoading}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        bgcolor: '#1b1b1b',
                        '&:hover': { bgcolor: '#333' },
                    }}
                    startIcon={
                        isLoading ? <CircularProgress size={16} color="inherit" /> : <Inventory2 sx={{ fontSize: 16 }} />
                    }
                >
                    {isLoading ? 'Registrando...' : 'Registrar entrada'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
