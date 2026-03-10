import { Box, TextField, Typography, MenuItem, CircularProgress } from '@mui/material';
import { useState, useMemo } from 'react';
import { AppFormModal } from '@/components/modals/AppFormModal';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { useRecordPayment } from '@/features/documents/hooks/useRecordPayment';
import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';

interface RecordPaymentModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
}

export function RecordPaymentModal({ open, onClose, document }: RecordPaymentModalProps) {
    const { mutate: recordPayment, isPending } = useRecordPayment();
    const { paymentMethods, isLoading: isLoadingMethods } = useIndexPaymentMethods();

    const [amount, setAmount] = useState<number>(document.balance || 0);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [methodId, setMethodId] = useState<number | ''>('');
    const [reference, setReference] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    const handleSave = () => {
        if (!amount || amount <= 0) return;

        recordPayment({
            id: String(document.id),
            payload: {
                amount,
                payment_date: date,
                payment_method_id: methodId || undefined,
                reference,
                notes
            }
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <AppFormModal
            isOpen={open}
            onClose={onClose}
            title="Consignar Pago"
            onConfirm={handleSave}
            confirmText={isPending ? "Procesando..." : "Registrar Pago"}
            isConfirmDisabled={isPending || amount <= 0}
            PaperProps={{
                sx: {
                    width: '500px',
                    maxWidth: '500px'
                }
            }}
            children={
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Registre un nuevo pago para el documento <strong>{document.number_serie}</strong>.
                    </Typography>

                    <TextField
                        fullWidth
                        label="Importe"
                        variant="filled"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        size="small"
                        required
                        error={amount <= 0}
                        helperText={amount <= 0 ? "El importe debe ser mayor a 0" : ""}
                    />

                    <TextField
                        fullWidth
                        label="Fecha de Pago"
                        variant="filled"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <TextField
                        select
                        fullWidth
                        label="Método de Pago"
                        variant="filled"
                        value={methodId}
                        onChange={(e) => setMethodId(Number(e.target.value))}
                        size="small"
                        disabled={isLoadingMethods}
                    >
                        <MenuItem value="">
                            <em>Ninguno</em>
                        </MenuItem>
                        {paymentMethods?.map((method: any) => (
                            <MenuItem key={method.id} value={method.id}>
                                {method.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Referencia"
                        variant="filled"
                        placeholder="Ej: Transferencia 1234"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        size="small"
                    />

                    <TextField
                        fullWidth
                        label="Notas"
                        variant="filled"
                        multiline
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        size="small"
                    />
                </Box>
            }
        />
    );
}
