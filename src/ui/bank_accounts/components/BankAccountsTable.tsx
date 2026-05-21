import { useMemo } from 'react';
import { MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { IBankAccount } from '@/types/bank_account.types';

interface BankAccountsTableProps {
	bankAccounts: IBankAccount[] | undefined;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
}

export default function BankAccountsTable(props: BankAccountsTableProps) {
	const { bankAccounts, onEdit, onDelete } = props;

	const columns = useMemo<MRT_ColumnDef<IBankAccount>[]>(
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
				accessorKey: 'account_holder',
				header: 'Titular'
			},
			{
				accessorKey: 'account_number',
				header: 'Número de Cuenta'
			},
			{
				accessorKey: 'swift',
				header: 'SWIFT',
				Cell: ({ cell }) => (
					<span className="font-semibold text-primary">
						{cell.getValue<string>()}
					</span>
				)
			}
		],
		[]
	);

	return (
		<DataTable
			data={bankAccounts || []}
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
					Editar cuenta
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
					Eliminar cuenta
				</MenuItem>
			]}
		/>
	);
}
