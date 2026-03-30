import { useMemo, useState } from 'react';
import { ParentDocumentInfo } from '@/domain/entities/documents/DocumentEntity';

export function useWaterfallAllocation(initialSuccessors: ParentDocumentInfo[], amount: number) {
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>(
        initialSuccessors.map(i => i.id)
    );

    const toggleInvoice = (id: number) => {
        setSelectedInvoiceIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const allocationData = useMemo(() => {
        let remaining = amount || 0;
        const mapped = initialSuccessors.map(invoice => {
            const isSelected = selectedInvoiceIds.includes(invoice.id);
            const invoiceBalance = invoice.balance ?? invoice.total ?? 0;
            const allocation = isSelected ? Math.min(remaining, invoiceBalance) : 0;
            remaining -= allocation;

            return {
                ...invoice,
                balance: invoiceBalance,
                allocation,
                isSelected
            };
        });

        const totalAllocated = mapped.reduce((sum, inv) => sum + inv.allocation, 0);

        return {
            childInvoicesWithAllocation: mapped,
            totalAllocated,
            remainingDebt: Math.max(0, amount - totalAllocated)
        };
    }, [initialSuccessors, amount, selectedInvoiceIds]);

    return {
        ...allocationData,
        toggleInvoice,
        selectedInvoiceIds
    };
}
