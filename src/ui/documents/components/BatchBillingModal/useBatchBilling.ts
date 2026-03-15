import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useIndexNumberSeries from '@/features/number_series/hooks/useIndexNumberSeries';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IDocumentActionRepository } from '@/domain/entities/documents/repositories/document.action.repository';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function useBatchBilling(
    open: boolean,
    selectedDocuments: DocumentEntity[],
    onClose: () => void,
    onSuccess?: () => void
) {
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');
    const [saving, setSaving] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const documentActionRepo = container.get<IDocumentActionRepository>(TYPES.IDocumentActionRepository);

    const firstDoc = selectedDocuments[0];
    const operation = firstDoc?.operation;
    const isSales = operation === 'sale';
    
    // El tipo de documento destino siempre es Factura (INV) o Factura de Compra (PINV)
    const targetDocTypeCode = isSales ? 'INV' : 'PINV';

    const { numberSeries, isLoading: isLoadingSeries } = useIndexNumberSeries(
        open ? targetDocTypeCode : undefined
    );

    useEffect(() => {
        if (open && numberSeries && numberSeries.length > 0 && !selectedSeriesId) {
            setSelectedSeriesId(numberSeries[0].id);
        }
    }, [numberSeries, open, selectedSeriesId]);

    const handleConfirm = async () => {
        if (selectedDocuments.length === 0) return;

        setSaving(true);
        try {
            const invoice = await documentActionRepo.batchConvert({
                source_ids: selectedDocuments.map(d => d.id),
                number_series_id: selectedSeriesId || undefined,
                status_key: 'issued' // Por defecto las agrupadas suelen emitirse directamente
            });

            toast.success('Factura agrupada generada con éxito');
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['number_series'] });
            onSuccess?.();
            onClose();
            
            // Redirigir a la nueva factura
            const basePath = isSales ? '/sales' : '/purchases';
            navigate(`${basePath}/view/${invoice.id}`);
        } catch (error: any) {
            console.error('Error in batch billing:', error);
            toast.error(error.response?.data?.message || 'Error al generar la factura agrupada');
        } finally {
            setSaving(false);
        }
    };

    return {
        numberSeries,
        isLoadingSeries,
        selectedSeriesId,
        setSelectedSeriesId,
        saving,
        handleConfirm,
        targetDocTypeCode
    };
}
