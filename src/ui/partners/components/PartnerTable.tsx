import { useMemo } from 'react';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { PartnerColumns } from './PartnerColumns';
import { MenuItem, ListItemIcon } from '@mui/material';
import { Theme } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';

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
			enableRowNumbers
			rowNumberDisplayMode="static"
			initialState={{
				density: 'compact',
				showColumnFilters: false,
				pagination: { pageSize: 15, pageIndex: 0 },
				showGlobalFilter: true,
				columnPinning: { left: ['mrt-row-numbers'], right: ['mrt-row-actions'] }
			}}
			muiPaginationProps={{
				rowsPerPageOptions: [5, 10, 25],
				variant: 'outlined',
				showRowsPerPage: true
			}}
			muiTableProps={{
				sx: {
					borderCollapse: 'collapse',
					border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
					'& .MuiTableCell-root': {
						border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
						padding: '6px 10px',
						fontSize: '0.8125rem',
						borderRadius: 0,
					},
					'& .MuiTableHead-root .MuiTableCell-root': {
						backgroundColor: (theme: Theme) =>
							theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
						fontWeight: 700,
						color: 'text.primary',
					}
				}
			}}
			muiTableBodyRowProps={({ row }) => ({
				onClick: () => onRowClick?.(row.original),
				sx: {
					cursor: onRowClick ? 'pointer' : 'default',
					backgroundColor: (theme: Theme) =>
						row.index % 2 === 0
							? 'transparent'
							: theme.palette.mode === 'dark'
								? 'rgba(255, 255, 255, 0.02)'
								: 'rgba(0, 0, 0, 0.01)',
					'&:hover': {
						backgroundColor: (theme: Theme) =>
							theme.palette.mode === 'dark'
								? 'rgba(255, 255, 255, 0.06)'
								: 'rgba(0, 0, 0, 0.03)',
					},
					boxShadow: 'none',
				}
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
				...(onDelete
					? [
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
						]
					: [])
			]}
		/>
	);
}
