import { useMemo, useState } from 'react';
import { ParentDocumentInfo } from '@/domain/entities/documents/DocumentEntity';

export function useWaterfallAllocation(initialSuccessors: ParentDocumentInfo[], amount: number) {
    // Facturas seleccionadas para participar en el pago
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>(
        initialSuccessors.map(i => i.id)
    );

    // Montos sobrescritos manualmente { invoiceId: amount }
    const [manualAmounts, setManualAmounts] = useState<Record<number, number>>({});

    const toggleInvoice = (id: number) => {
        setSelectedInvoiceIds(prev => {
            const isRemoving = prev.includes(id);
            if (isRemoving) {
                // Si quitamos la factura, también quitamos su monto manual
                const newManual = { ...manualAmounts };
                delete newManual[id];
                setManualAmounts(newManual);
                return prev.filter(i => i !== id);
            }
            return [...prev, id];
        });
    };

    const setManualAmount = (id: number, val: number | null) => {
        setManualAmounts(prev => {
            const newManual = { ...prev };
            if (val === null || val === undefined) {
                delete newManual[id];
            } else {
                newManual[id] = val;
            }
            return newManual;
        });
    };

    const allocationData = useMemo(() => {
        let remaining = amount || 0;
        
        // 1. Primero aplicamos los montos manuales de las facturas seleccionadas
        const manualAllocatedTotal = Object.entries(manualAmounts).reduce((sum, [id, val]) => {
            if (selectedInvoiceIds.includes(Number(id))) {
                return sum + val;
            }
            return sum;
        }, 0);

        // Si lo manual supera el total, hay un error de sobre-asignación
        const isOverAllocated = manualAllocatedTotal > amount;
        
        // El dinero que queda para la cascada automática
        let autoRemaining = Math.max(0, amount - manualAllocatedTotal);

        const mapped = initialSuccessors.map(invoice => {
            const isSelected = selectedInvoiceIds.includes(invoice.id);
            const invoiceBalance = invoice.balance ?? invoice.total ?? 0;
            
            let allocation = 0;
            let isManual = false;

            if (isSelected) {
                if (manualAmounts[invoice.id] !== undefined) {
                    // Respetar monto manual
                    allocation = manualAmounts[invoice.id];
                    isManual = true;
                } else {
                    // Aplicar cascada automática con lo que sobra
                    allocation = Math.min(autoRemaining, invoiceBalance);
                    autoRemaining -= allocation;
                }
            }

            return {
                ...invoice,
                balance: invoiceBalance,
                allocation,
                isSelected,
                isManual
            };
        });

        const totalAllocated = mapped.reduce((sum, inv) => sum + inv.allocation, 0);

        return {
            childInvoicesWithAllocation: mapped,
            totalAllocated,
            isOverAllocated,
            remainingDebt: Math.max(0, amount - totalAllocated)
        };
    }, [initialSuccessors, amount, selectedInvoiceIds, manualAmounts]);

    return {
        ...allocationData,
        toggleInvoice,
        setManualAmount,
        manualAmounts
    };
}
