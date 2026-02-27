import { useMemo } from 'react';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { getDocumentColumns } from './DocumentColumns';
import DataTable from '@/components/data-table/DataTable';
import { MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';

interface DocumentTableProps {
    documents: DocumentEntity[] | undefined;
    isLoading?: boolean;
    operation: 'sale' | 'purchase';
}

export default function DocumentTable(props: DocumentTableProps) {
    const { documents, isLoading, operation } = props;
    const navigate = useNavigate();
    const columns = useMemo(() => getDocumentColumns(operation), [operation]);

    const basePath = operation === 'sale' ? '/sales' : '/purchases';

    return (
        <DataTable
            data={documents || []}
            columns={columns}
            state={{ isLoading }}
            enablePagination
            initialState={{
                density: 'compact',
                pagination: { pageSize: 15, pageIndex: 0 },
                columnPinning: { right: ['mrt-row-actions'] },
                showGlobalFilter: true
            }}
            muiTableBodyRowProps={({ row }) => ({
                onClick: () => navigate(`${basePath}/${row.original.id}`),
                sx: {
                    cursor: 'pointer',
                    backgroundColor: row.index % 2 === 0 ? 'transparent' : 'action.hover',
                }
            })}
            renderRowActionMenuItems={({ closeMenu, row }) => [
                <MenuItem
                    key="view"
                    onClick={() => {
                        navigate(`${basePath}/${row.original.id}`);
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
    );
}
