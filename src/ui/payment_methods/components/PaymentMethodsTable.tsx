import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Switch, Tooltip, Stack, Typography, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { PaymentMethod } from '@/types/payment_method.types';

interface PaymentMethodsTableProps {
	paymentMethods: PaymentMethod[] | undefined;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onStatusChange: (id: number, currentStatus: boolean) => void;
}

export default function PaymentMethodsTable(props: PaymentMethodsTableProps) {
	const { paymentMethods, onEdit, onDelete, onStatusChange } = props;
	const theme = useTheme();

	const configs = useMemo<Record<string, { label: string; icon: string; color: string }>>(() => ({
		cash: {
			label: 'Efectivo',
			icon: 'heroicons-outline:banknotes',
			color: theme.palette.success.main
		},
		bank_transfer: {
			label: 'Transferencia',
			icon: 'heroicons-outline:building-library',
			color: theme.palette.info.main
		},
		credit_card: {
			label: 'Tarjeta de Crédito',
			icon: 'heroicons-outline:credit-card',
			color: theme.palette.primary.main
		},
		debit_card: {
			label: 'Tarjeta de Débito',
			icon: 'heroicons-outline:credit-card',
			color: theme.palette.secondary.main
		},
		check: {
			label: 'Cheque',
			icon: 'heroicons-outline:document-text',
			color: theme.palette.warning.main
		},
		other: {
			label: 'Otro',
			icon: 'heroicons-outline:ellipsis-horizontal-circle',
			color: theme.palette.grey[600]
		}
	}), [theme]);

	const columns = useMemo<MRT_ColumnDef<PaymentMethod>[]>(
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
				accessorKey: 'type',
				header: 'Tipo',
				Cell: ({ cell }) => {
					const type = cell.getValue<string>();
					const typeConfig = configs[type] || configs.other;
					return (
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
						>
							<FuseSvgIcon
								size={16}
								sx={{ color: typeConfig.color }}
							>
								{typeConfig.icon}
							</FuseSvgIcon>
							<Typography sx={{ fontSize: '0.8125rem' }}>{typeConfig.label}</Typography>
						</Stack>
					);
				}
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
					<Tooltip
						title={row.original.is_active ? 'Desactivar método' : 'Activar método'}
						placement="top"
					>
						<Switch
							checked={row.original.is_active}
							onChange={() => onStatusChange(row.original.id!, row.original.is_active)}
							color="primary"
							size="small"
						/>
					</Tooltip>
				)
			}
		],
		[configs, onStatusChange]
	);

	return (
		<DataTable
			data={paymentMethods || []}
			columns={columns}
			enableRowSelection={false}
			renderRowActionMenuItems={({ closeMenu, row }) => [
				<MenuItem
					key="edit"
					onClick={() => {
						onEdit(row.original.id!);
						closeMenu();
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
					</ListItemIcon>
					Editar método
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
					Eliminar método
				</MenuItem>
			]}
		/>
	);
}
