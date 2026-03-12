import { useState, useMemo } from 'react';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { getDocumentColumns } from './DocumentColumns';
import DataTable from '@/components/data-table/DataTable';
import { MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';
import DocumentStatusModal from './status-modal';
import BatchBillingModal from './BatchBillingModal';

interface DocumentTableProps {
    documents: DocumentEntity[] | undefined;
    isLoading?: boolean;
    operation: 'sale' | 'purchase';
    onStatusUpdated?: () => void;
}

export default function DocumentTable(props: DocumentTableProps) {
    const { documents, isLoading, operation, onStatusUpdated } = props;
    const navigate = useNavigate();
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentEntity | null>(null);
    const [batchBillingOpen, setBatchBillingOpen] = useState(false);
    const [docsToBill, setDocsToBill] = useState<DocumentEntity[]>([]);

    const handleStatusClick = (document: DocumentEntity) => {
        setSelectedDocument(document);
        setStatusModalOpen(true);
    };

    const handleCloseStatusModal = () => {
        setStatusModalOpen(false);
        // Wait for the modal transition to finish before clearing the data
        setTimeout(() => setSelectedDocument(null), 300);
    };

    const handleCloseBatchBilling = () => {
        setBatchBillingOpen(false);
        setTimeout(() => setDocsToBill([]), 300);
    };

    const columns = useMemo(() => getDocumentColumns(operation, handleStatusClick), [operation]);

    const basePath = operation === 'sale' ? '/sales' : '/purchases';

    return (
        <>
            <DataTable
                data={documents || []}
                columns={columns}
                state={{ isLoading }}
                enablePagination
                enableRowSelection={(row) => {
                    const doc = row.original;
                    // Solo permitimos seleccionar albaranes en estado entregado/recibido
                    return ['DLV', 'PDLV'].includes(doc.document_type_code || '') && 
                           ['delivered', 'received'].includes(doc.status.key);
                }}
                initialState={{
                    density: 'compact',
                    pagination: { pageSize: 15, pageIndex: 0 },
                    columnPinning: { right: ['mrt-row-actions'] },
                    showGlobalFilter: true
                }}
                renderTopToolbarCustomActions={({ table }) => {
                    const selectedRows = table.getSelectedRowModel().rows;
                    const hasSelection = selectedRows.length > 0;

                    const handleBatchBill = () => {
                        const selectedDocs = selectedRows.map(row => row.original);
                        const firstDoc = selectedDocs[0];
                        
                        // Validaciones rápidas de UI
                        const differentPartner = selectedDocs.some(d => d.partner_id !== firstDoc.partner_id);
                        const differentItemType = selectedDocs.some(d => d.item_type !== firstDoc.item_type);

                        if (differentPartner) {
                            alert("Todos los documentos seleccionados deben ser del mismo Partner.");
                            return;
                        }

                        if (differentItemType) {
                            alert("No se pueden mezclar productos y servicios en la misma factura.");
                            return;
                        }

                        setDocsToBill(selectedDocs);
                        setBatchBillingOpen(true);
                    };

                    return hasSelection ? (
                        <MenuItem
                            onClick={handleBatchBill}
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'bold',
                                border: '1px solid',
                                borderRadius: 1,
                                px: 2
                            }}
                        >
                            <ListItemIcon>
                                <FuseSvgIcon size={20}>heroicons-outline:document-duplicate</FuseSvgIcon>
                            </ListItemIcon>
                            Facturar Selección ({selectedRows.length})
                        </MenuItem>
                    ) : null;
                }}
                muiTableBodyRowProps={({ row }) => ({
                    onClick: () => navigate(`${basePath}/view/${row.original.id}`),
                    sx: {
                        cursor: 'pointer',
                        backgroundColor: row.index % 2 === 0 ? 'transparent' : 'action.hover',
                    }
                })}
                renderRowActionMenuItems={({ closeMenu, row }) => [
                    <MenuItem
                        key="view"
                        onClick={() => {
                            navigate(`${basePath}/view/${row.original.id}`);
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
                        </ListItemIcon>
                        Ver detalle
                    </MenuItem>,
                    <MenuItem
                        key="edit"
                        onClick={() => {
                            navigate(`${basePath}/${row.original.id}/edit`);
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <FuseSvgIcon>heroicons-outline:pencil-square</FuseSvgIcon>
                        </ListItemIcon>
                        Editar
                    </MenuItem>,
                    <MenuItem
                        key="delete"
                        onClick={() => {
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <FuseSvgIcon color="error">heroicons-outline:trash</FuseSvgIcon>
                        </ListItemIcon>
                        Eliminar
                    </MenuItem>
                ]}
            />
            <DocumentStatusModal
                open={statusModalOpen}
                onClose={handleCloseStatusModal}
                document={selectedDocument}
                onStatusUpdated={onStatusUpdated}
            />
            <BatchBillingModal
                open={batchBillingOpen}
                onClose={handleCloseBatchBilling}
                selectedDocuments={docsToBill}
                onSuccess={onStatusUpdated}
            />
        </>
    );
}

