import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Switch } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

interface FileTypesTableProps {
	fileTypes: FileTypeEntity[] | undefined;
	onEdit: (fileType: FileTypeEntity) => void;
	onDelete: (id: number) => void;
	onStatusChange: (fileType: FileTypeEntity) => void;
}

export default function FileTypesTable(props: FileTypesTableProps) {
	const { fileTypes, onEdit, onDelete, onStatusChange } = props;

	const columns = useMemo<MRT_ColumnDef<FileTypeEntity>[]>(
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
				accessorKey: 'description',
				header: 'Descripción',
				Cell: ({ cell }) => cell.getValue<string>() || '-'
			},
			{
				accessorKey: 'is_active',
				header: 'Estado',
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
			data={fileTypes || []}
			columns={columns}
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
					Editar
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
					Eliminar
				</MenuItem>
			]}
		/>
	);
}
