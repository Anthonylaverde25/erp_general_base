import { useMemo } from 'react';
import { MenuItem, ListItemIcon, Switch, Tooltip, Stack, Typography } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { StoreEntity } from '@/domain/entities/stores/StoreEntity';

interface StoresTableProps {
	stores: StoreEntity[] | undefined;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	onStatusChange: (id: number, currentStatus: boolean) => void;
}

export default function StoresTable(props: StoresTableProps) {
	const { stores, onEdit, onDelete, onStatusChange } = props;

	const formatAddress = (store: StoreEntity) => {
		if (!store.address) return null;

		const { street, street_2, city, state, postal_code, country } = store.address;
		return {
			short: `${city}, ${state}`,
			full: [street, street_2, `${city}, ${state} ${postal_code}`, country].filter(Boolean).join(', ')
		};
	};

	const columns = useMemo<MRT_ColumnDef<StoreEntity>[]>(
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
				Cell: ({ cell }) => cell.getValue<string>() || '-'
			},
			{
				accessorKey: 'address',
				header: 'Dirección',
				Cell: ({ row }) => {
					const addr = formatAddress(row.original);
					if (!addr) {
						return (
							<Typography
								variant="body2"
								color="text.disabled"
								fontStyle="italic"
								sx={{ fontSize: '0.8125rem' }}
							>
								Sin dirección
							</Typography>
						);
					}
					return (
						<Tooltip
							title={addr.full}
							placement="top"
						>
							<Stack
								direction="row"
								spacing={0.5}
								alignItems="center"
							>
								<FuseSvgIcon
									size={16}
									color="action"
								>
									heroicons-outline:map-pin
								</FuseSvgIcon>
								<Typography sx={{ fontSize: '0.8125rem' }}>{addr.short}</Typography>
							</Stack>
						</Tooltip>
					);
				}
			},
			{
				accessorKey: 'is_active',
				header: 'Estado',
				Cell: ({ row }) => (
					<Tooltip
						title={row.original.is_active ? 'Desactivar tienda' : 'Activar tienda'}
						placement="top"
					>
						<Switch
							checked={row.original.is_active}
							onChange={() => onStatusChange(row.original.id!, row.original.is_active!)}
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
			data={stores || []}
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
					Editar tienda
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
					Eliminar tienda
				</MenuItem>
			]}
		/>
	);
}
