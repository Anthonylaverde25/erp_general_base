import type { ICellRendererParams } from 'ag-grid-community';
import type { DocumentLineItem, DocumentLineTaxItem } from '../../types';
import { TaxMultiSelect } from '../../TaxMultiSelect';

export function TaxChipsCellRenderer({ data, node }: ICellRendererParams<DocumentLineItem>) {
    if (!data) return null;

    const handleChange = (newTaxes: DocumentLineTaxItem[]) => {
        if (!data || !node) return;
        const updatedRow = { ...data, taxes: newTaxes };
        document.dispatchEvent(new CustomEvent('doc-line-update', { detail: updatedRow }));
    };

    return (
        <TaxMultiSelect
            taxes={data.taxes || []}
            onChange={handleChange}
            usePortal
        />
    );
}
