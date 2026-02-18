import { useMemo } from 'react';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import { ItemColumns } from './ItemColumns';
import { MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';

interface ItemTableProps {
    items: ItemEntity[] | undefined;
    isLoading?: boolean;
    onEdit: (item: ItemEntity) => void;
    onDelete?: (id: number) => void;
    onRowClick?: (item: ItemEntity) => void;
}

export default function ItemTable(props: ItemTableProps) {
    const { items, isLoading, onEdit, onDelete, onRowClick } = props;

    const columns = useMemo(() => ItemColumns, []);

    if (isLoading) {
        return null;
    }

    return (
        <DataTable
            data={items || []}
            columns={columns}
            state={{ isLoading }}
            enablePagination
            initialState={{
                density: 'compact',
                showColumnFilters: false,
                pagination: { pageSize: 15, pageIndex: 0 },
                showGlobalFilter: true,
                columnPinning: { left: [], right: ['mrt-row-actions'] }
            }}
            muiPaginationProps={{
                rowsPerPageOptions: [5, 10, 25],
                variant: 'outlined',
                showRowsPerPage: true
            }}
            muiTableBodyRowProps={({ row }) => ({
                onClick: () => onRowClick?.(row.original),
                sx: { cursor: onRowClick ? 'pointer' : 'default' }
            })}
            renderRowActionMenuItems={({ closeMenu, row }) => [
                <MenuItem
                    key="edit"
                    onClick={() => {
                        onEdit(row.original);
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <FuseSvgIcon>heroicons-outline:pencil-square</FuseSvgIcon>
                    </ListItemIcon>
                    Edit
                </MenuItem>,
                ...(onDelete ? [
                    <MenuItem
                        key="delete"
                        onClick={() => {
                            onDelete(row.original.id);
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                        </ListItemIcon>
                        Delete
                    </MenuItem>
                ] : [])
            ]}
        />
    );
}
