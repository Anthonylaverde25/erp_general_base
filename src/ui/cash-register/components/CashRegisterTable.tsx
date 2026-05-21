import { useMemo } from 'react';
import { Box, Typography, useTheme, IconButton, Tooltip, Card, Checkbox } from '@mui/material';
import { ArrowUpCircle, ArrowDownCircle, MoreHorizontal, Eye } from 'lucide-react';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { ICashRegisterMovement } from '@/types/cash-register.types';
import useToggleMovementChecked from '@/features/cash-register/hooks/useToggleMovementChecked';

interface CashRegisterTableProps {
	movements: ICashRegisterMovement[];
}

export default function CashRegisterTable({ movements }: CashRegisterTableProps) {
	const theme = useTheme();
	const toggleMutation = useToggleMovementChecked();

	const columns = useMemo<MRT_ColumnDef<ICashRegisterMovement>[]>(
		() => [
			{
				id: 'checked_status',
				header: 'Verificado',
				size: 110,
				Cell: ({ row }) => {
					const isChecked = row.original.checked ?? false;
					return (
						<Checkbox
							size="small"
							checked={isChecked}
							onChange={() => {
								const id = Number(row.original.id);
								toggleMutation.mutate(id);
							}}
							sx={{
								color: 'text.secondary',
								'&.Mui-checked': {
									color: 'primary.main',
								},
							}}
						/>
					);
				}
			},
			{
				accessorKey: 'type',
				header: 'Tipo',
				Cell: ({ cell }) => {
					const value = String(cell.getValue<string>());
					const isDeposit = value.toLowerCase() === 'payment';
					console.log('valor', value);
					return (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							{isDeposit ? (
								<ArrowUpCircle size={18} color={theme.palette.success.main} />
							) : (
								<ArrowDownCircle size={18} color={theme.palette.error.main} />
							)}
							<Typography variant="body2">{isDeposit ? 'Ingreso' : 'Egreso'}</Typography>
						</Box>
					);
				},
				size: 130
			},
			{
				accessorKey: 'amount',
				header: 'Monto',
				Cell: ({ cell, row }) => {
					const value = Number(cell.getValue<number>());
					const direction = String(row.original.direction ?? '').toLowerCase();
					const signedAmount = direction === 'out' ? value * -1 : value;
					return (
						<Typography variant="body2" fontWeight={800} color={signedAmount >= 0 ? 'success.main' : 'error.main'}>
							{signedAmount.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
						</Typography>
					);
				},
				size: 140
			},
			{
				accessorKey: 'created_at',
				header: 'Fecha / Hora',
				Cell: ({ cell }) => new Date(String(cell.getValue<string>())).toLocaleString('es-ES'),
				size: 180
			},
			{
				accessorKey: 'payment_method',
				header: 'Método',
				size: 140
			}
		],
		[theme.palette, toggleMutation]
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Box>
					<Typography variant="h6" fontWeight={800}>
						Movimientos de Jornada
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Registro detallado de transacciones
					</Typography>
				</Box>
				<IconButton size="small">
					<MoreHorizontal size={20} />
				</IconButton>
			</Box>

			<Card sx={{ borderRadius: '0', border: 'none', boxShadow: 'none' }}>
				<DataTable<ICashRegisterMovement>
					columns={columns}
					data={movements}
					enableRowSelection={false}
					enableRowActions
					enableRowNumbers
					rowNumberDisplayMode="static"
					enableColumnResizing={false}
					getRowId={(row) => String(row.id)}
					renderRowActionMenuItems={() => [
						<Tooltip title="Ver Detalle" key="view">
							<IconButton size="small">
								<Eye size={16} />
							</IconButton>
						</Tooltip>
					]}
					initialState={{
						density: 'compact',
						showGlobalFilter: true,
						columnPinning: {
							left: ['mrt-row-numbers'],
							right: ['mrt-row-actions']
						}
					}}
					muiTableProps={{
						sx: {
							borderCollapse: 'collapse',
							border: (theme) => `1px solid ${theme.palette.divider}`,
							'& th, & td': {
								border: (theme) => `1px solid ${theme.palette.divider}`,
							},
						},
					}}
					muiTableHeadCellProps={{
						sx: {
							backgroundColor: (theme) =>
								theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
							fontWeight: 700,
							border: (theme) => `1px solid ${theme.palette.divider}`,
						},
					}}
					muiTableBodyCellProps={{
						sx: {
							padding: '6px 10px',
							fontSize: '0.8125rem',
						},
					}}
				/>
			</Card>
		</Box>
	);
}
