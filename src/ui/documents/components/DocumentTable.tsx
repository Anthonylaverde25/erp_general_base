import { useState, useMemo } from 'react';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { getDocumentColumns } from './DocumentColumns';
import DataTable from '@/components/data-table/DataTable';
import { MenuItem, ListItemIcon, Box, Stack, Divider, Typography, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';
import DocumentStatusModal from './status-modal';
import BatchBillingModal from './BatchBillingModal';
import FloatingSelectionBar from './FloatingSelectionBar';
import DocumentEmptyState from './common/DocumentEmptyState';

interface DocumentTableProps {
    documents: DocumentEntity[] | undefined;
    isLoading?: boolean;
    operation: 'sale' | 'purchase';
    onStatusUpdated?: () => void;
}

export default function DocumentTable(props: DocumentTableProps) {
    const { documents, isLoading, operation, onStatusUpdated } = props;
    const navigate = useNavigate();
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentEntity | null>(null);

    const handleStatusClick = (document: DocumentEntity) => {
        setSelectedDocument(document);
        setStatusModalOpen(true);
    };

    const handleCloseStatusModal = () => {
        setStatusModalOpen(false);
        // Wait for the modal transition to finish before clearing the data
        setTimeout(() => setSelectedDocument(null), 300);
    };

    const columns = useMemo(() => getDocumentColumns(operation, handleStatusClick), [operation]);

    const basePath = operation === 'sale' ? '/sales' : '/purchases';

    if (!isLoading && (!documents || documents.length === 0)) {
        return <DocumentEmptyState operation={operation} />;
    }

    return (
        <>
            <DataTable
                data={documents || []}
                columns={columns}
                state={{ isLoading, rowSelection }}
                onRowSelectionChange={setRowSelection}
                enablePagination
                enableRowSelection={true}
                initialState={{
                    density: 'compact',
                    pagination: { pageSize: 15, pageIndex: 0 },
                    columnPinning: { right: ['mrt-row-actions'] },
                    showGlobalFilter: true
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
        </>
    );
}

