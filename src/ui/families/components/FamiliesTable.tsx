import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Switch } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { FamilyEntity } from '@/domain/entities/families/FamilyEntity';

interface FamiliesTableProps {
	families: FamilyEntity[] | undefined;
	isLoading?: boolean;
	onEdit: (family: FamilyEntity) => void;
	onDelete: (id: number) => void;
	onStatusChange: (family: FamilyEntity) => void;
}

export default function FamiliesTable(props: FamiliesTableProps) {
	const { families, isLoading, onEdit, onDelete, onStatusChange } = props;

	const columns = useMemo<MRT_ColumnDef<FamilyEntity>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ cell }) => (
					<span className="font-semibold text-13">
						{cell.getValue<string>()}
					</span>
				)
			},
			{
				accessorKey: 'percentage',
				header: 'Profit %',
				Cell: ({ cell }) => `${cell.getValue<number>()}%`
			},
			{
				id: 'tax_rates',
				header: 'Tax Rate',
				accessorFn: (row) => row.tax_rates?.map((t) => t.name).join(', ') || '',
				Cell: ({ row }) => row.original.tax_rates?.map((t) => t.name).join(', ') || '-'
			},
			{
				accessorKey: 'is_active',
				header: 'Active',
				Cell: ({ row }) => (
					<Switch
						checked={row.original.is_active}
						onChange={() => onStatusChange(row.original)}
						inputProps={{ 'aria-label': 'controlled' }}
						size="small"
					/>
				)
			}
		],
		[onStatusChange]
	);

	return (
		<DataTable
			data={families || []}
			columns={columns}
			state={{ isLoading }}
			enableRowSelection={false}
			renderRowActionMenuItems={({ closeMenu, row }) => [
				<MenuItem
					key="edit"
					onClick={() => {
						onEdit(row.original);
						closeMenu();
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
					</ListItemIcon>
					Edit
				</MenuItem>,
				<MenuItem
					key="delete"
					onClick={() => {
						onDelete(row.original.id);
						closeMenu();
					}}
					sx={{ color: 'error.main' }}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20} className="text-red">heroicons-outline:trash</FuseSvgIcon>
					</ListItemIcon>
					Delete
				</MenuItem>
			]}
		/>
	);
}
