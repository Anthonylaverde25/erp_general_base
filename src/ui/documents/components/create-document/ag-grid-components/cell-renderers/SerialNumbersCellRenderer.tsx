import React, { useRef, useEffect } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import type { ICellRendererParams } from 'ag-grid-community';
import type { DocumentLineItem } from '../../types';
import { Box, Tooltip, Button } from '@mui/material';

export function SerialNumbersCellRenderer({ data }: ICellRendererParams<DocumentLineItem>) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const btn = buttonRef.current;
        if (!btn) return;

        const stopPropagation = (e: Event) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        const handleClick = (e: Event) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            // Dispatch event to open serial numbers modal
            document.dispatchEvent(new CustomEvent('doc-line-open-serials', { detail: data }));
        };

        btn.addEventListener('click', handleClick);
        btn.addEventListener('mousedown', stopPropagation);

        return () => {
            btn.removeEventListener('click', handleClick);
            btn.removeEventListener('mousedown', stopPropagation);
        };
    }, [data]);

    if (!data || !data.item_id || !data.has_serials) {
        return <span style={{ color: '#aaa', fontSize: '11px' }}>-</span>;
    }

    const qty = Math.max(1, Math.floor(Number(data.quantity) || 1));
    const enteredSerialsCount = data.serial_numbers?.length || 0;
    const isComplete = enteredSerialsCount === qty;

    return (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
            <Tooltip
                title={
                    isComplete
                        ? `Todas las series registradas (${enteredSerialsCount} de ${qty}). Haga clic para editar.`
                        : `Series pendientes: faltan ${qty - enteredSerialsCount} de ${qty} por registrar. Haga clic para ingresar.`
                }
                arrow
            >
                <Button
                    ref={buttonRef}
                    size="small"
                    variant="outlined"
                    color={isComplete ? 'success' : 'warning'}
                    startIcon={isComplete ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    sx={{
                        fontSize: '10px',
                        textTransform: 'none',
                        py: '2px',
                        px: '6px',
                        height: '22px',
                        borderRadius: '4px', // Sharp Edges: as per AGENTS.md
                        fontWeight: 700,
                        color: isComplete ? '#16a34a' : '#d97706',
                        borderColor: isComplete ? '#bbf7d0' : '#fef3c7',
                        bgcolor: isComplete ? '#f0fdf4' : '#fffbeb',
                        '&:hover': {
                            bgcolor: isComplete ? '#dcfce7' : '#fef3c7',
                            borderColor: isComplete ? '#86efac' : '#fde047',
                        }
                    }}
                >
                    {enteredSerialsCount} / {qty} Series
                </Button>
            </Tooltip>
        </Box>
    );
}
