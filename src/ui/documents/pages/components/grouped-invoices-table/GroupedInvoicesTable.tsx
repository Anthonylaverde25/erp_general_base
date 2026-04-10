import { useState, useMemo } from 'react';
import { Box, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material';
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
import { Search } from 'lucide-react';

export default function GroupedInvoicesTable(props: GroupedInvoicesTableProps) {
    const { documents, isLoading, onStatusUpdated } = props;
    const navigate = useNavigate();
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentEntity | null>(null);
    const [batchBillingOpen, setBatchBillingOpen] = useState(false);
    const [docsToBill, setDocsToBill] = useState<DocumentEntity[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocuments = useMemo(() => {
        if (!documents) return [];
        if (!searchTerm) return documents;

        const lowTerm = searchTerm.toLowerCase();
        return documents.filter(doc => {
            const partnerName = doc.partner_name?.toLowerCase() || '';
            const cif = doc.partner?.cif?.toLowerCase() || '';
            const email = doc.partner?.email?.toLowerCase() || '';

            return partnerName.includes(lowTerm) || cif.includes(lowTerm) || email.includes(lowTerm);
        });
    }, [documents, searchTerm]);

    const groupedDocuments = useMemo(() => {
        return filteredDocuments.reduce((acc, doc) => {
            const partnerName = doc.partner_name || 'Desconocido';
            if (!acc[partnerName]) acc[partnerName] = [];
            acc[partnerName].push(doc);
            return acc;
        }, {} as Record<string, DocumentEntity[]>);
    }, [filteredDocuments]);

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

    const handleBatchBill2 = () => {
        const selectedIds = Object.keys(rowSelection);
        const selectedDocs = documents?.filter(d => selectedIds.includes(d.id.toString())) || [];

        if (selectedDocs.length === 0) return;

        const firstDoc = selectedDocs[0];
        const differentPartner = selectedDocs.some(d => d.partner_id !== firstDoc.partner_id);

        if (differentPartner) {
            alert("Error de Consolidación: Todos los documentos seleccionados deben pertenecer al mismo Partner.");
            return;
        }

        const idsParam = selectedIds.join(',');
        navigate(`/sales/create/INV?from_document_ids=${idsParam}`);
    };

    const selectedIds = Object.keys(rowSelection);
    const selectedRowsData = documents?.filter(doc => rowSelection[doc.id.toString()]) || [];
    const selectedTotal = selectedRowsData.reduce((acc, doc) => acc + (doc.total || 0), 0);

    if (isLoading) return <Box sx={{ p: 8, textAlign: 'center' }}><Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Sincronizando información...</Typography></Box>;

    if (!documents || documents.length === 0) {
        return <EmptyState />;
    }

    return (
        <Box className="flex flex-col">
            <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderBottom: (theme) => `1px solid ${theme.palette?.divider || '#e0e0e0'}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    placeholder="Buscar por nombre, CIF o email de partner..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} className="text-gray-400" />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '8px',
                            bgcolor: 'action.hover',
                            '& fieldset': { border: (theme) => `1px solid ${theme.palette.divider}` },
                            fontSize: '13px'
                        }
                    }}
                />
                {searchTerm && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {Object.keys(groupedDocuments).length} partners encontrados
                    </Typography>
                )}
            </Box>

            {selectedIds.length > 0 && (
                <SelectionToolbar
                    selectedCount={selectedIds.length}
                    totalAmount={selectedTotal}
                    onCancel={() => setRowSelection({})}
                    onConfirm={handleBatchBill}
                    onConfirm2={handleBatchBill2}
                />
            )}

            <TableContainer component={Paper} elevation={0} sx={{ borderTop: (theme) => `1px solid ${theme.palette?.divider || '#e0e0e0'}`, borderBottom: (theme) => `1px solid ${theme.palette?.divider || '#e0e0e0'}`, borderRadius: 0, overflow: 'hidden' }}>
                <Table aria-label="collapsible table" stickyHeader>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>

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
