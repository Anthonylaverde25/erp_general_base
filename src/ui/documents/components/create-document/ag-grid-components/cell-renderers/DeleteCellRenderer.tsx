import { DeleteOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';
import type { DocumentLineItem } from '../../types';
import { useDocumentCreate } from "../../../../context/DocumentCreateContext";

export function DeleteCellRenderer({ data }: ICellRendererParams<DocumentLineItem>) {
    const { isReadOnly } = useDocumentCreate();

    if ((!data?.code && !data?.description) || isReadOnly) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IconButton
                size="small"
                onClick={() => {
                    document.dispatchEvent(new CustomEvent('doc-line-delete', { detail: data.id }));
                }}
                aria-label={`Eliminar línea ${data.id}`}
                sx={{ padding: '2px', color: '#e57373' }}
            >
                <DeleteOutline style={{ fontSize: 16 }} />
            </IconButton>
        </div>
    );
}
