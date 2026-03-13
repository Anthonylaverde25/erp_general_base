import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { Key } from 'react';

export interface GroupedInvoicesTableProps {
    documents: DocumentEntity[] | undefined;
    isLoading?: boolean;
    onStatusUpdated?: () => void;
}

export interface PartnerRowProps {
    key?: Key;
    partnerName: string;
    docs: DocumentEntity[];
    selectedIds: string[];
    onTogglePartner: (selected: boolean) => void;
    onToggleDoc: (docId: string) => void;
    onStatusClick: (doc: DocumentEntity) => void;
    navigate: (path: string) => void;
}

export interface InvoiceRowProps {
    key?: Key;
    doc: DocumentEntity;
    isSelected: boolean;
    onToggle: (docId: string) => void;
    onStatusClick: (doc: DocumentEntity) => void;
    navigate: (path: string) => void;
}
