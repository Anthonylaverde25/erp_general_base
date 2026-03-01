import type { GridApi } from 'ag-grid-community';
import type { DocumentLineItem } from '../../types';

export function makeEmptyLine(presetId?: string): DocumentLineItem {
    return {
        id: presetId || `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        item_id: undefined,
        code: '',
        description: '',
        quantity: '1',
        unitPrice: '0',
        discount: '0',
        taxes: [],
        subtotal: '0.00',
    };
}

/** Collect all rows from AG Grid into an array */
export function collectRows(api: GridApi<DocumentLineItem>): DocumentLineItem[] {
    const rows: DocumentLineItem[] = [];
    api.forEachNode(n => { if (n.data) rows.push(n.data); });
    return rows;
}
