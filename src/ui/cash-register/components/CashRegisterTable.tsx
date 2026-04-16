import { useMemo, useEffect } from 'react';
import { Box, Typography, useTheme, Chip, IconButton, Tooltip, Card, Button, alpha } from '@mui/material';
import { 
	ArrowUpCircle, 
	ArrowDownCircle, 
	MoreHorizontal,
	Eye,
	Banknote,
	CreditCard,
	ArrowRightLeft,
	PlusCircle,
	MinusCircle
} from 'lucide-react';
import DataTable from '@/components/data-table/DataTable';
import { MRT_ColumnDef } from 'material-react-table';

interface IMovimiento {
	id: string;
	tipo: 'Ingreso' | 'Egreso';
	metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
	estado: 'Completado' | 'Pendiente' | 'Cancelado';
	monto: number;
	fecha: string;
	comentario: string;
	usuario: string;
}

const mockMovimientos: IMovimiento[] = [
	{ id: '#5021', tipo: 'Ingreso', metodoPago: 'Efectivo', estado: 'Completado', monto: 1250.50, fecha: '16 Abr 2026 14:20', comentario: 'Venta de mercadería general', usuario: 'A. Laverde' },
	{ id: '#5022', tipo: 'Egreso', metodoPago: 'Transferencia', estado: 'Completado', monto: -320.00, fecha: '16 Abr 2026 14:45', comentario: 'Pago a proveedor de suministros', usuario: 'D. Garcia' },
	{ id: '#5023', tipo: 'Ingreso', metodoPago: 'Tarjeta', estado: 'Pendiente', monto: 850.00, fecha: '16 Abr 2026 15:10', comentario: 'Abono de cliente recurrente', usuario: 'A. Laverde' },
	{ id: '#5024', tipo: 'Egreso', metodoPago: 'Tarjeta', estado: 'Cancelado', monto: -100.00, fecha: '16 Abr 2026 15:30', comentario: 'Corrección de cargo duplicado', usuario: 'System' },
	{ id: '#5025', tipo: 'Ingreso', metodoPago: 'Efectivo', estado: 'Completado', monto: 2100.00, fecha: '16 Abr 2026 15:45', comentario: 'Cierre de terminal T1', usuario: 'D. Garcia' },
];

interface CashRegisterTableProps {
	onPendingUpdate?: (count: number) => void;
}

export default function CashRegisterTable({ onPendingUpdate }: CashRegisterTableProps) {
	const theme = useTheme();

	useEffect(() => {
		const pendingCount = mockMovimientos.filter(m => m.estado === 'Pendiente').length;
		onPendingUpdate?.(pendingCount);
	}, [onPendingUpdate]);

	const columns = useMemo<MRT_ColumnDef<IMovimiento>[]>(
		() => [
			{
				accessorKey: 'tipo',
				header: 'Tipo',
				Cell: ({ cell }) => {
					const value = cell.getValue<string>();
					return (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							{value === 'Ingreso' ? (
								<ArrowUpCircle size={18} color={theme.palette.success.main} />
							) : (
								<ArrowDownCircle size={18} color={theme.palette.error.main} />
							)}
							<Typography variant="body2">{value}</Typography>
						</Box>
					);
				},
				size: 130,
			},
			{
				accessorKey: 'metodoPago',
				header: 'Método',
				Cell: ({ cell }) => {
					const value = cell.getValue<string>();
					let Icon = Banknote;
					let color = theme.palette.success.main;
					
					if (value === 'Tarjeta') {
						Icon = CreditCard;
						color = theme.palette.info.main;
					} else if (value === 'Transferencia') {
						Icon = ArrowRightLeft;
						color = theme.palette.secondary.main;
					}

					return (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Icon size={16} color={color} />
							<Typography variant="caption" fontWeight={600} color="text.secondary">{value}</Typography>
						</Box>
					);
				},
				size: 140,
			},
			{
				accessorKey: 'id',
				header: 'ID',
				size: 120,
			},
			{
				accessorKey: 'estado',
				header: 'Estado',
				Cell: ({ cell }) => {
					const value = cell.getValue<string>();
					const color = 
						value === 'Completado' ? 'success' : 
						value === 'Pendiente' ? 'warning' : 'error';
					return (
						<Chip 
							label={value} 
							size="small" 
							sx={{ 
								borderRadius: '4px', 
								fontWeight: 700,
								fontSize: '11px',
								bgcolor: alpha(
									value === 'Completado' ? theme.palette.success.main : 
									value === 'Pendiente' ? theme.palette.warning.main : 
									theme.palette.error.main, 
									0.12
								),
								color: 
									value === 'Completado' ? theme.palette.success.dark : 
									value === 'Pendiente' ? theme.palette.warning.dark : 
									theme.palette.error.dark,
								border: 'none'
							}} 
						/>
					);
				},
				size: 130,
			},
			{
				accessorKey: 'monto',
				header: 'Monto Total',
				Cell: ({ cell }) => {
					const value = cell.getValue<number>();
					return (
						<Typography 
							variant="body2" 
							fontWeight={800} 
							color={value >= 0 ? 'success.main' : 'error.main'}
						>
							{value.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
						</Typography>
					);
				},
				size: 140,
			},
			{
				accessorKey: 'fecha',
				header: 'Fecha / Hora',
				size: 180,
			},
			{
				accessorKey: 'usuario',
				header: 'Responsable',
				size: 140,
			},
		],
		[theme.palette]
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Box>
					<Typography variant="h6" fontWeight={800}>Movimientos de Jornada</Typography>
					<Typography variant="caption" color="text.secondary">Registro detallado de transacciones</Typography>
				</Box>
				<Box sx={{ display: 'flex', gap: 1.5 }}>
					<IconButton size="small"><MoreHorizontal size={20} /></IconButton>
				</Box>
			</Box>
			
			<Card sx={{ borderRadius: '4px', border: 'none', shadow: 'none', boxShadow: 'none' }}>
				<DataTable<IMovimiento>
					columns={columns}
					data={mockMovimientos}
					enableRowSelection
					enableRowActions
					renderRowActionMenuItems={({ row }) => [
						<Tooltip title="Ver Detalle" key="view">
							<IconButton size="small"><Eye size={16} /></IconButton>
						</Tooltip>
					]}
					renderDetailPanel={({ row }) => (
						<Box sx={{ p: 3, bgcolor: '#f1f5f9', borderLeft: '4px solid #005483' }}>
							<Typography variant="subtitle2" fontWeight={700} gutterBottom>
								Desglose de Operación: {row.original.id}
							</Typography>
							<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, mt: 2 }}>
								<Box>
									<Typography variant="caption" color="text.secondary" display="block">Comentario</Typography>
									<Typography variant="body2">{row.original.comentario}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" display="block">Método de Pago</Typography>
									<Typography variant="body2">{row.original.metodoPago}</Typography>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary" display="block">Sucursal</Typography>
									<Typography variant="body2">Principal - Zona Norte</Typography>
								</Box>
							</Box>
						</Box>
					)}
					initialState={{
						density: 'comfortable',
						showGlobalFilter: true,
					}}
				/>
			</Card>
		</Box>
	);
}
