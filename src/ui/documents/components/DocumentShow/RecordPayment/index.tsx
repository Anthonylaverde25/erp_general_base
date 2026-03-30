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

/**
 * RecordPaymentModal (Orchestrator)
 * Refactored for maintainability using modular components and custom hooks.
 */
export function RecordPaymentModal({ open, onClose, document }: RecordPaymentModalProps) {
    const { mutate: recordPayment, isPending } = useRecordPayment();
    const { paymentMethods, isLoading: isLoadingMethods } = useIndexPaymentMethods();

    const [amount, setAmount] = useState<number>(document.balance || 0);
    const [methodId, setMethodId] = useState<number | ''>('');
    const [reference, setReference] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [enableNotes, setEnableNotes] = useState<boolean>(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Initial Filter for Invoices that can receive waterfall payment
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

    // Waterfall Logic Hook
    const {
        childInvoicesWithAllocation,
        totalAllocated,
        toggleInvoice
    } = useWaterfallAllocation(initialPendingInvoices, amount);

    const handleSave = () => {
        if (!amount || amount <= 0) return;

        recordPayment({
            id: String(document.id),
            payload: {
                amount,
                payment_date: date,
                payment_method_id: methodId || undefined,
                reference,
                notes: enableNotes ? notes : undefined
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
                    width: '720px', // 20% less than 900px
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
                        formatMoney={formatMoney}
                    />
                )}
            </Box>

            <RecordPaymentFooter
                totalAllocated={totalAllocated}
                amount={amount}
                isPending={isPending}
                onClose={onClose}
                onConfirm={handleSave}
                formatMoney={formatMoney}
            />
        </Dialog>
    );
}
