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
}

export default function PartnerTable(props: PartnerTableProps) {
    const { partners, isLoading, onEdit, onDelete } = props;

    const columns = useMemo(() => PartnerColumns, []);

    if (isLoading) {
        return null; // Or a loading spinner, but DataTable might handle empty state. 
        // The user's example used `if (isLoading) return <FuseLoading />;`
        // But since I don't see FuseLoading imported in my context immediately, 
        // and DataTable handles `state: { isLoading }` (passed via ...rest or defaults),
        // I will pass isLoading to DataTable.
        // Actually, looking at DataTable implementation, it passes `...rest` to `useMaterialReactTable`.
        // `MaterialReactTable` handles `state.isLoading`.
    }

    return (

        <DataTable
            data={partners || []}
            columns={columns}
            state={{ isLoading }}
            enablePagination
            initialState={{
                density: 'compact', // Preserving DataTable default
                showColumnFilters: false, // Default
                pagination: { pageSize: 15, pageIndex: 0 }, // Adjusted to match default 15 roughly, or keep 10
                showGlobalFilter: true, // User request
                columnPinning: { left: [], right: ['mrt-row-actions'] } // Preserving sticky actions
            }}
            muiPaginationProps={{
                rowsPerPageOptions: [5, 10, 25],
                variant: 'outlined',
                showRowsPerPage: true // Explicitly show
            }}
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
