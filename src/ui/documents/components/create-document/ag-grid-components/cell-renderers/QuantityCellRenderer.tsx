import React, { useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ICellRendererParams } from 'ag-grid-community';
import type { DocumentLineItem } from '../../types';
import { useDocumentCreate } from "../../../../context/DocumentCreateContext";
import { Box, Tooltip, IconButton } from '@mui/material';

export function QuantityCellRenderer({ data }: ICellRendererParams<DocumentLineItem>) {
    const { lineStockWarnings, setStockConflicts } = useDocumentCreate();
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    
    if (!data) return null;

    const warning = lineStockWarnings[data.id];

    useEffect(() => {
        const btn = buttonRef.current;
        if (!btn || !warning) return;

        const stopPropagation = (e: Event) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        const handleClick = (e: Event) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            // Map this single line warning to a stock conflict object
            const conflict = {
                line_index: 0, // Mock index
                line_id: data.id, // Pass unique line ID to update warning status
                item_id: data.item_id,
                item_name: data.code || 'Artículo',
                requested_quantity: Number(data.quantity),
                store_id: warning.store_id,
                store_name: warning.store_name || 'Almacén de origen',
                available_stock: warning.available_stock,
                alternative_stores: warning.alternative_stores,
                is_single_line_resolution: true, // Special flag for modal to close instead of resubmit
            };

            setStockConflicts([conflict]);
        };

        btn.addEventListener('click', handleClick);
        btn.addEventListener('mousedown', stopPropagation);

        return () => {
            btn.removeEventListener('click', handleClick);
            btn.removeEventListener('mousedown', stopPropagation);
        };
    }, [warning, data, setStockConflicts]);

    return (
        <Box display="flex" alignItems="center" justifyContent="flex-end" width="100%" height="100%" gap={0.5}>
            <span style={{ fontSize: '13px', fontWeight: warning ? 700 : 'normal', color: warning ? (warning.is_resolved ? '#16a34a' : '#e11d48') : 'inherit' }}>
                {data.quantity}
            </span>
            {warning && (
                <Tooltip title={warning.is_resolved ? `Stock resuelto mediante transferencia.` : `Stock insuficiente. Disponible: ${warning.available_stock} uds. Haga clic para resolver.`} arrow>
                    <IconButton
                        ref={buttonRef}
                        size="small"
                        disabled={!!warning.is_resolved}
                        sx={{
                            color: warning.is_resolved ? '#16a34a' : '#e11d48',
                            padding: '2px',
                            cursor: warning.is_resolved ? 'default' : 'pointer',
                        }}
                    >
                        {warning.is_resolved ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
}
