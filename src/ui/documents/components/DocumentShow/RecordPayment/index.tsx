import { Box, Dialog } from '@mui/material';
import { useState, useMemo } from 'react';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { useRecordPayment } from '@/features/documents/hooks/useRecordPayment';
import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';

// Modular Components
import { RecordPaymentHeader } from './components/RecordPaymentHeader';
import { RecordPaymentForm } from './components/RecordPaymentForm';
import { RecordPaymentWaterfall } from './components/RecordPaymentWaterfall';
import { RecordPaymentFooter } from './components/RecordPaymentFooter';

// Hooks
import { useWaterfallAllocation } from './hooks/useWaterfallAllocation';

interface RecordPaymentModalProps {
    open: boolean;
    onClose: () => void;
    document: DocumentEntity;
}

export function RecordPaymentModal({ open, onClose, document }: RecordPaymentModalProps) {
    const { mutate: recordPayment, isPending } = useRecordPayment();
    const { paymentMethods, isLoading: isLoadingMethods } = useIndexPaymentMethods();

    const [amount, setAmount] = useState<number>(0);
    const [methodId, setMethodId] = useState<number | ''>('');
    const [reference, setReference] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [enableNotes, setEnableNotes] = useState<boolean>(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const initialPendingInvoices = useMemo(() => {
        if (!['DLV', 'PDLV'].includes(document.document_type_code || '')) return [];
        return document.successors.filter(s => {
            const docTypeName = s.document_type_name?.toLowerCase() || '';
            const statusName = s.status?.name?.toLowerCase() || '';
            const isInvoice = docTypeName.includes('factura') || docTypeName.includes('invoice');
            const isFinalStatus = ['cobrada', 'pagada', 'collected', 'paid'].includes(statusName);
            return isInvoice && !isFinalStatus;
        });
    }, [document]);

    const { 
        childInvoicesWithAllocation, 
        totalAllocated, 
        isOverAllocated,
        toggleInvoice,
        setManualAmount,
        manualAmounts
    } = useWaterfallAllocation(initialPendingInvoices, amount);

    const handleSave = () => {
        if (!amount || amount <= 0 || isOverAllocated) return;

        // Construir el array de alocaciones manuales para el backend
        const allocations = Object.entries(manualAmounts)
            .filter(([id]) => childInvoicesWithAllocation.find(i => i.id === Number(id))?.isSelected)
            .map(([id, val]) => ({
                document_id: Number(id),
                amount: val
            }));

        recordPayment({
            id: String(document.id),
            payload: {
                amount,
                payment_date: date,
                payment_method_id: methodId || undefined,
                reference,
                notes: enableNotes ? notes : undefined,
                allocations: allocations.length > 0 ? allocations : undefined
            }
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
    };

    const hasWaterfall = initialPendingInvoices.length > 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    width: '720px',
                    maxWidth: '720px',
                    borderRadius: '4px',
                    bgcolor: '#ffffff',
                    boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
                    overflow: 'hidden'
                }
            }}
        >
            <RecordPaymentHeader 
                numberSerie={document.number_serie} 
                partnerName={document.partner_name} 
                onClose={onClose} 
            />

            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <RecordPaymentForm 
                    amount={amount} setAmount={setAmount}
                    totalBalance={document.balance || 0}
                    date={date} setDate={setDate}
                    methodId={methodId} setMethodId={setMethodId}
                    reference={reference} setReference={setReference}
                    notes={notes} setNotes={setNotes}
                    enableNotes={enableNotes} setEnableNotes={setEnableNotes}
                    paymentMethods={paymentMethods}
                    isLoadingMethods={isLoadingMethods}
                />

                {hasWaterfall && (
                    <RecordPaymentWaterfall 
                        invoices={childInvoicesWithAllocation} 
                        onToggle={toggleInvoice} 
                        onManualAmount={setManualAmount}
                        formatMoney={formatMoney} 
                    />
                )}
            </Box>

            <RecordPaymentFooter 
                totalAllocated={totalAllocated}
                amount={amount}
                isPending={isPending}
                isOverAllocated={isOverAllocated}
                onClose={onClose}
                onConfirm={handleSave}
                formatMoney={formatMoney}
            />
        </Dialog>
    );
}
