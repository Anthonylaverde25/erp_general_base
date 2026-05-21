import { useMemo } from 'react';
import { Chip, Switch, Tooltip, MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { IRole } from '@/types/role.types';

interface RolesTableProps {
	roles: IRole[] | undefined;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onStatusChange: (id: number, currentStatus: boolean) => void;
}

export default function RolesTable(props: RolesTableProps) {
	const { roles, onEdit, onDelete, onStatusChange } = props;

	const columns = useMemo<MRT_ColumnDef<IRole>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Nombre',
				Cell: ({ cell }) => (
					<span className="font-semibold text-13">
						{cell.getValue<string>()}
					</span>
				)
			},
			{
				accessorKey: 'code',
				header: 'Código',
				Cell: ({ cell }) => (
					<Chip
						label={cell.getValue<string>()}
						size="small"
						sx={{
							borderRadius: 0,
							fontWeight: 600,
							fontFamily: 'monospace'
						}}
					/>
				)
			},
			{
				accessorKey: 'description',
				header: 'Descripción',
				Cell: ({ cell }) => cell.getValue<string>() || '-'
			},
			{
				accessorKey: 'active',
				header: 'Estado',
				Cell: ({ row }) => (
					<Tooltip
						title={row.original.active ? 'Desactivar rol' : 'Activar rol'}
						placement="top"
					>
						<Switch
							checked={row.original.active}
							onChange={() => onStatusChange(row.original.id, row.original.active)}
							color="primary"
							size="small"
						/>
					</Tooltip>
				)
			}
		],
		[onStatusChange]
	);

	return (
		<DataTable
			data={roles || []}
			columns={columns}
			enableRowSelection={false}
			renderRowActionMenuItems={({ closeMenu, row }) => [
				<MenuItem
					key="edit"
					onClick={() => {
						onEdit(row.original.id);
						closeMenu();
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
					</ListItemIcon>
					Editar rol
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
					Eliminar rol
				</MenuItem>
			]}
		/>
	);
}
