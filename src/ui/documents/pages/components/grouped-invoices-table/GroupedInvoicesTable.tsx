import { useState, useMemo } from 'react';
import { Box, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import DocumentStatusModal from '../../../components/status-modal';
import BatchBillingModal from '../../../components/BatchBillingModal';
import { SAP_THEME } from './theme';
import { GroupedInvoicesTableProps } from './types';
import PartnerRow from './PartnerRow';
import SelectionToolbar from './SelectionToolbar';
import EmptyState from './EmptyState';

export default function GroupedInvoicesTable(props: GroupedInvoicesTableProps) {
    const { documents, isLoading, onStatusUpdated } = props;
    const navigate = useNavigate();
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentEntity | null>(null);
    const [batchBillingOpen, setBatchBillingOpen] = useState(false);
    const [docsToBill, setDocsToBill] = useState<DocumentEntity[]>([]);

    const groupedDocuments = useMemo(() => {
        if (!documents) return {};
        return documents.reduce((acc, doc) => {
            const partnerName = doc.partner_name || 'Desconocido';
            if (!acc[partnerName]) acc[partnerName] = [];
            acc[partnerName].push(doc);
            return acc;
        }, {} as Record<string, DocumentEntity[]>);
    }, [documents]);

    const handleStatusClick = (document: DocumentEntity) => {
        setSelectedDocument(document);
        setStatusModalOpen(true);
    };

    const handleToggleDoc = (docId: string) => {
        setRowSelection(prev => {
            const next = { ...prev };
            if (next[docId]) delete next[docId];
            else next[docId] = true;
            return next;
        });
    };

    const handleTogglePartner = (partnerDocs: DocumentEntity[], selected: boolean) => {
        setRowSelection(prev => {
            const next = { ...prev };
            partnerDocs.forEach(doc => {
                if (selected) next[doc.id.toString()] = true;
                else delete next[doc.id.toString()];
            });
            return next;
        });
    };

    const handleBatchBill = () => {
        const selectedIds = Object.keys(rowSelection);
        const selectedDocs = documents?.filter(d => selectedIds.includes(d.id.toString())) || [];

        if (selectedDocs.length === 0) return;

        const firstDoc = selectedDocs[0];
        const differentPartner = selectedDocs.some(d => d.partner_id !== firstDoc.partner_id);
        const differentItemType = selectedDocs.some(d => d.item_type !== firstDoc.item_type);

        if (differentPartner) {
            alert("Error de Consolidación: Todos los documentos seleccionados deben pertenecer al mismo Partner.");
            return;
        }

        if (differentItemType) {
            alert("Incompatibilidad Técnica: No se pueden agrupar bienes y servicios en el mismo comprobante.");
            return;
        }

        setDocsToBill(selectedDocs);
        setBatchBillingOpen(true);
    };

    const selectedIds = Object.keys(rowSelection);
    const selectedRowsData = documents?.filter(doc => rowSelection[doc.id.toString()]) || [];
    const selectedTotal = selectedRowsData.reduce((acc, doc) => acc + (doc.total || 0), 0);

    if (isLoading) return <Box sx={{ p: 8, textAlign: 'center' }}><Typography variant="body2" sx={{ color: SAP_THEME.textSecondary, fontStyle: 'italic' }}>Sincronizando información...</Typography></Box>;

    if (!documents || documents.length === 0) {
        return <EmptyState />;
    }

    return (
        <Box className="flex flex-col">
            {selectedIds.length > 0 && (
                <SelectionToolbar
                    selectedCount={selectedIds.length}
                    totalAmount={selectedTotal}
                    onCancel={() => setRowSelection({})}
                    onConfirm={handleBatchBill}
                />
            )}

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${SAP_THEME.border}`, borderRadius: 0, overflow: 'hidden' }}>
                <Table aria-label="collapsible table" stickyHeader>
                    <TableHead sx={{ bgcolor: SAP_THEME.headerBg }}>

                    </TableHead>
                    <TableBody>
                        {Object.entries(groupedDocuments).map(([partnerName, docs]) => (
                            <PartnerRow
                                key={partnerName}
                                partnerName={partnerName}
                                docs={docs}
                                selectedIds={selectedIds}
                                onTogglePartner={(sel) => handleTogglePartner(docs, sel)}
                                onToggleDoc={handleToggleDoc}
                                onStatusClick={handleStatusClick}
                                navigate={navigate}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <DocumentStatusModal
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                document={selectedDocument}
                onStatusUpdated={onStatusUpdated}
            />
            <BatchBillingModal
                open={batchBillingOpen}
                onClose={() => setBatchBillingOpen(false)}
                selectedDocuments={docsToBill}
                onSuccess={() => {
                    setRowSelection({});
                    onStatusUpdated?.();
                }}
            />
        </Box>
    );
}
