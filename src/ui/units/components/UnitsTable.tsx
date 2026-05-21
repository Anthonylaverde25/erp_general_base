import { useMemo } from 'react';
import { MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { UnitEntity } from '@/domain/entities/units/UnitEntity';

interface UnitsTableProps {
	units: UnitEntity[] | undefined;
	isLoading?: boolean;
	onEdit: (unit: UnitEntity) => void;
	onDelete: (id: number) => void;
}

export default function UnitsTable(props: UnitsTableProps) {
	const { units, isLoading, onEdit, onDelete } = props;

	const columns = useMemo<MRT_ColumnDef<UnitEntity>[]>(
		() => [
			{
				accessorKey: 'code',
				header: 'Code',
				Cell: ({ cell }) => (
					<span className="font-semibold text-13">
						{cell.getValue<string>()}
					</span>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name'
			},
			{
				accessorKey: 'unit_type_name',
				header: 'Unit Type',
				Cell: ({ cell }) => cell.getValue<string>() || '-'
			}
		],
		[]
	);

	return (
		<DataTable
			data={units || []}
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
