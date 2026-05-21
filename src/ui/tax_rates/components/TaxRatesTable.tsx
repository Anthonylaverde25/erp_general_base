import { useMemo } from 'react';
import { MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';

interface TaxRatesTableProps {
	taxRates: TaxRateEntity[] | undefined;
	onEdit: (taxRate: TaxRateEntity) => void;
	onDelete: (id: number) => void;
}

export default function TaxRatesTable(props: TaxRatesTableProps) {
	const { taxRates, onEdit, onDelete } = props;

	const columns = useMemo<MRT_ColumnDef<TaxRateEntity>[]>(
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
				Cell: ({ cell }) => cell.getValue<string>() || 'No aplica'
			},
			{
				accessorKey: 'percentage',
				header: 'Percentage (%)',
				Cell: ({ cell }) => `${cell.getValue<number>()}%`
			},
			{
				accessorKey: 'tax_type.name',
				header: 'Tax Type',
				Cell: ({ row }) => row.original.tax_type?.name || '-'
			}
		],
		[]
	);

	return (
		<DataTable
			data={taxRates || []}
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
					Edit
				</MenuItem>,
				<MenuItem
					key="delete"
					onClick={() => {
						onDelete(row.original.id!);
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
