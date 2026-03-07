import { useState, useEffect } from 'react';
import { DocumentEntity, DocumentStatus } from '@/domain/entities/documents/DocumentEntity';
import axiosInstance from '@/lib/@axios';
import useIndexNumberSeries from '@/features/number_series/hooks/useIndexNumberSeries';

export function useDocumentStatus(
    open: boolean,
    document: DocumentEntity | null,
    onClose: () => void,
    onStatusUpdated?: () => void
) {
    const [selectedKey, setSelectedKey] = useState<string>('');
    const [availableStatuses, setAvailableStatuses] = useState<DocumentStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | ''>('');

    const isSales = document?.operation === 'sale';
    const isDraft = document?.status?.key === 'draft';
    const needsSeriesSelection = isSales && isDraft && selectedKey !== 'draft' && !document?.number_serie;

    const { numberSeries, isLoading: isLoadingSeries } = useIndexNumberSeries(
        needsSeriesSelection ? document?.document_type_code : undefined
    );

    useEffect(() => {
        if (needsSeriesSelection && numberSeries && numberSeries.length > 0 && !selectedSeriesId) {
            setSelectedSeriesId(numberSeries[0].id);
        }
    }, [numberSeries, needsSeriesSelection, selectedSeriesId]);

    useEffect(() => {
        if (document?.status) {
            setSelectedKey(document.status.key);
        }
    }, [document]);

    useEffect(() => {
        if (open && document?.document_type_code) {
            setLoading(true);
            axiosInstance
                .get(`document-types/${document.document_type_code}/statuses`)
                .then(({ data }) => setAvailableStatuses(data.statuses || []))
                .catch(() => setAvailableStatuses([]))
                .finally(() => setLoading(false));
        }
        if (!open) {
            setAvailableStatuses([]);
            setSaving(false);
        }
    }, [open, document?.document_type_code]);

    const handleSave = async () => {
        if (!document || !selectedKey || selectedKey === document.status?.key) return;

        setSaving(true);
        try {
            await axiosInstance.put(`documents/${document.id}`, {
                status_key: selectedKey,
                ...(needsSeriesSelection && selectedSeriesId ? { number_series_id: selectedSeriesId } : {})
            });
            onStatusUpdated?.();
            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setSaving(false);
        }
    };

    const hasChanged = document ? selectedKey !== document.status?.key : false;

    return {
        selectedKey,
        setSelectedKey,
        availableStatuses,
        loading,
        saving,
        handleSave,
        hasChanged,
        needsSeriesSelection,
        numberSeries,
        isLoadingSeries,
        selectedSeriesId,
        setSelectedSeriesId
    };
}
