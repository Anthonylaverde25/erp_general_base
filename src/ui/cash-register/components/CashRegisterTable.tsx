import { useMemo, useEffect } from 'react';
import { Box, Typography, useTheme, IconButton, Tooltip, Card } from '@mui/material';
import { ArrowUpCircle, ArrowDownCircle, MoreHorizontal, Eye } from 'lucide-react';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';
import { ICashRegisterMovement } from '@/types/cash-register.types';

interface CashRegisterTableProps {
	movements: ICashRegisterMovement[];
	onPendingUpdate?: (count: number) => void;
}

export default function CashRegisterTable({ movements, onPendingUpdate }: CashRegisterTableProps) {
	const theme = useTheme();

	useEffect(() => {
		onPendingUpdate?.(0);
	}, [movements, onPendingUpdate]);

	const columns = useMemo<MRT_ColumnDef<ICashRegisterMovement>[]>(
		() => [
			{
				accessorKey: 'type',
				header: 'Tipo',
				Cell: ({ cell }) => {
					const value = String(cell.getValue<string>());
					const isDeposit = value.toLowerCase() === 'deposit';
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
			{ accessorKey: 'id', header: 'ID', size: 120 },
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
		[theme.palette]
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

			<Card sx={{ borderRadius: '4px', border: 'none', boxShadow: 'none' }}>
				<DataTable<ICashRegisterMovement>
					columns={columns}
					data={movements}
					enableRowSelection
					enableRowActions
					renderRowActionMenuItems={() => [
						<Tooltip title="Ver Detalle" key="view">
							<IconButton size="small">
								<Eye size={16} />
							</IconButton>
						</Tooltip>
					]}
					initialState={{ density: 'comfortable', showGlobalFilter: true }}
				/>
			</Card>
		</Box>
	);
}
