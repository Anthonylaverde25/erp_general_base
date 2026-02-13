import { useMemo } from 'react';
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import { PartnerColumns } from "./PartnerColumns";
import { MenuItem, ListItemIcon, Paper } from '@mui/material';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import DataTable from "@/components/data-table/DataTable";

interface PartnerTableProps {
    partners: PartnerEntity[] | undefined;
    isLoading?: boolean;
    onEdit: (partner: PartnerEntity) => void;
    onDelete?: (id: number) => void;
    onRowClick?: (partner: PartnerEntity) => void;
}

export default function PartnerTable(props: PartnerTableProps) {
    const { partners, isLoading, onEdit, onDelete, onRowClick } = props;

    const columns = useMemo(() => PartnerColumns, []);

    if (isLoading) {
        return null;
    }

    return (

        <DataTable
            data={partners || []}
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

