import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Switch } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { UnitTypeEntity } from '@/domain/entities/unit_types/UnitTypeEntity';

interface UnitTypesTableProps {
	unitTypes: UnitTypeEntity[] | undefined;
	isLoading?: boolean;
	onEdit: (unitType: UnitTypeEntity) => void;
	onDelete: (id: number) => void;
}

export default function UnitTypesTable(props: UnitTypesTableProps) {
	const { unitTypes, isLoading, onEdit, onDelete } = props;

	const columns = useMemo<MRT_ColumnDef<UnitTypeEntity>[]>(
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
				accessorKey: 'description',
				header: 'Description',
				Cell: ({ cell }) => cell.getValue<string>() || '-'
			},
			{
				accessorKey: 'is_active',
				header: 'Active',
				Cell: ({ row }) => (
					<Switch
						checked={row.original.is_active}
						disabled
						inputProps={{ 'aria-label': 'controlled' }}
						size="small"
					/>
				)
			}
		],
		[]
	);

	return (
		<DataTable
			data={unitTypes || []}
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
