import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Switch, Chip, Tooltip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { TaxTypeEntity } from '@/domain/entities/tax_types/TaxTypeEntity';

interface TaxTypesTableProps {
	taxTypes: TaxTypeEntity[] | undefined;
	onEdit: (taxType: TaxTypeEntity) => void;
	onDelete: (id: number) => void;
	onStatusChange: (taxType: TaxTypeEntity) => void;
}

export default function TaxTypesTable(props: TaxTypesTableProps) {
	const { taxTypes, onEdit, onDelete, onStatusChange } = props;

	const columns = useMemo<MRT_ColumnDef<TaxTypeEntity>[]>(
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
				accessorKey: 'operation_label',
				header: 'Operación',
				Cell: ({ cell }) => (
					<Chip
						label={cell.getValue<string>() || '-'}
						size="small"
						sx={{ width: 'fit-content', borderRadius: 0, height: 18, fontSize: '0.75rem' }}
					/>
				)
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
			data={taxTypes || []}
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
					Editar tipo
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
					Eliminar tipo
				</MenuItem>
			]}
		/>
	);
}
