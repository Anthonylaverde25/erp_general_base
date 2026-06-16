import { useState, useCallback, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { GridApi } from 'ag-grid-community';
import type { DocumentLineItem } from '../../types';
import type { DocumentFormValues } from '../../../../schemas/documentSchema';
import { collectRows, makeEmptyLine } from '../utils';

export function useDocumentTableSync() {
    const { setValue, getValues, watch } = useFormContext<DocumentFormValues>();
    console.log('watch form values', watch())
    const gridApiRef = useRef<GridApi<DocumentLineItem> | null>(null);

    // Initialize rows from form values — in edit mode, these will already be populated
    const [rows, setRows] = useState<DocumentLineItem[]>(() => {
        const formLines = getValues('lines');
        if (formLines && formLines.length > 0) {
            return formLines as DocumentLineItem[];
        }
        return [makeEmptyLine('01')];
    });

    // Watch form lines — when reset() or values prop updates the form, sync to AG Grid
    const formLines = watch('lines') as DocumentLineItem[] | undefined;
    useEffect(() => {
        if (!formLines || formLines.length === 0) return;
        console.log('[useDocumentTableSync] watch formLines useEffect - formLines:', formLines);
        // Only sync if the data actually changed (avoid infinite loop)
        const api = gridApiRef.current;
        setRows(formLines);
        if (api) {
            api.setGridOption('rowData', formLines);
        }
    }, [formLines]);

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
        
        // Collect current grid's rows
        const currentGridRows: DocumentLineItem[] = [];
        api.forEachNode(node => {
            if (node.data) currentGridRows.push(node.data);
        });
        console.log('[useDocumentTableSync] handleCellValueChanged - currentGridRows:', currentGridRows);

        // Merge with existing master lines to preserve other sections
        const masterLines = (getValues('lines') || []) as DocumentLineItem[];
        console.log('[useDocumentTableSync] handleCellValueChanged - masterLines:', masterLines);
        const next = masterLines.map(masterRow => {
            const updated = currentGridRows.find(r => r.id === masterRow.id);
            return updated ? updated : masterRow;
        });
        console.log('[useDocumentTableSync] handleCellValueChanged - next:', next);

        setRows(next);
        syncToForm(next);
    }, [syncToForm, getValues]);

    const handleRowDragEnd = useCallback(() => {
        const api = gridApiRef.current;
        if (!api) return;
        const current = collectRows(api);
        setRows(current);
        syncToForm(current);
    }, [syncToForm]);

    const onGridReady = useCallback((params: { api: GridApi<DocumentLineItem> }) => {
        gridApiRef.current = params.api;
        // Use the current rows (might already have edit mode data)
        const currentRows = getValues('lines') as DocumentLineItem[];
        if (currentRows && currentRows.length > 0) {
            setRows(currentRows);
            syncToForm(currentRows);
        } else {
            syncToForm(rows);
        }
    }, [rows, syncToForm, getValues]);

    return {
        rows: (rows || []) as DocumentLineItem[],
        gridApiRef,
        handleAddLine,
        handleCellValueChanged,
        handleRowDragEnd,
        onGridReady
    };
}
