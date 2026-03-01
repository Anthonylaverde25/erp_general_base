import { useState, useCallback, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { GridApi } from 'ag-grid-community';
import type { DocumentLineItem } from '../../types';
import type { DocumentFormValues } from '../../../schemas/documentSchema';
import { collectRows, makeEmptyLine } from '../utils';

export function useDocumentTableSync() {
    const { setValue } = useFormContext<DocumentFormValues>();
    const gridApiRef = useRef<GridApi<DocumentLineItem> | null>(null);

    // Local rows state — AG Grid reads from this via rowData prop
    const [rows, setRows] = useState<DocumentLineItem[]>(() => [
        makeEmptyLine('01'),
        makeEmptyLine('02'),
    ]);

    /** Sync rows → React Hook Form (one-way push) */
    const syncToForm = useCallback((currentRows: DocumentLineItem[]) => {
        setValue('lines', currentRows, { shouldDirty: true });
    }, [setValue]);

    // Listen for custom events dispatched from cell editors / renderers
    useEffect(() => {
        const handleUpdate = (e: Event) => {
            const updatedRow = (e as CustomEvent).detail as DocumentLineItem;
            setRows(prev => {
                const next = prev.map(r => r.id === updatedRow.id ? updatedRow : r);
                syncToForm(next);
                return next;
            });
        };
        const handleDelete = (e: Event) => {
            const rowId = (e as CustomEvent).detail as string;
            setRows(prev => {
                const next = prev.filter(r => r.id !== rowId);
                syncToForm(next);
                return next;
            });
        };
        document.addEventListener('doc-line-update', handleUpdate);
        document.addEventListener('doc-line-delete', handleDelete);
        return () => {
            document.removeEventListener('doc-line-update', handleUpdate);
            document.removeEventListener('doc-line-delete', handleDelete);
        };
    }, [syncToForm]);

    const handleAddLine = useCallback(() => {
        const api = gridApiRef.current;
        if (api) api.stopEditing();
        const newRow = makeEmptyLine();
        setRows(prev => {
            const next = [...prev, newRow];
            syncToForm(next);
            return next;
        });
    }, [syncToForm]);

    const handleCellValueChanged = useCallback(() => {
        const api = gridApiRef.current;
        if (!api) return;
        const current = collectRows(api);
        setRows(current);
        syncToForm(current);
    }, [syncToForm]);

    const handleRowDragEnd = useCallback(() => {
        const api = gridApiRef.current;
        if (!api) return;
        const current = collectRows(api);
        setRows(current);
        syncToForm(current);
    }, [syncToForm]);

    const onGridReady = useCallback((params: { api: GridApi<DocumentLineItem> }) => {
        gridApiRef.current = params.api;
        syncToForm(rows); // initial sync
    }, [rows, syncToForm]);

    return {
        rows,
        gridApiRef,
        handleAddLine,
        handleCellValueChanged,
        handleRowDragEnd,
        onGridReady
    };
}
