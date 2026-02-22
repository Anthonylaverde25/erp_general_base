import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Chip, Pagination } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIndexStockMovements } from '@/application/hooks/items/useIndexStockMovements';
import { StockMovementEntity } from '@/domain/entities/items/repositories/item.action.repository';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface ItemMovementHistoryTableProps {
	itemId: number;
}



const formatReason = (reason: string) => {
	const dictionary: Record<string, string> = {
		adjustment: 'Ajuste',
		purchase: 'Compra',
		sale: 'Venta',
		transfer: 'Transferencia',
		return: 'Devolución'
	};
	return dictionary[reason] || reason;
};

export default function ItemMovementHistoryTable({ itemId }: ItemMovementHistoryTableProps) {
	const [page, setPage] = useState(1);
	const perPage = 15;

	const { data, isLoading, isError } = useIndexStockMovements(itemId, page, perPage);

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Typography
				variant="body2"
				color="error"
			>
				Error al cargar el historial de movimientos.
			</Typography>
		);
	}

	const movements = data?.data || [];
	const meta = data?.meta;

	if (movements.length === 0) {
		return (
			<Typography
				variant="body2"
				color="text.secondary"
			>
				Sin movimientos de inventario registrados.
			</Typography>
		);
	}

	return (
		<Box>
			<Box sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Fecha</TableHead>
							<TableHead>Movimiento</TableHead>
							<TableHead className="text-center">Cant.</TableHead>
							<TableHead>Motivo</TableHead>
							<TableHead>Usuario</TableHead>
							<TableHead>Almacén</TableHead>
							<TableHead>Notas</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{movements.map((movement: StockMovementEntity) => {
							const date = new Date(movement.created_at);
							return (
								<TableRow key={movement.id}>
									<TableCell>
										<Typography variant="body2" fontWeight={500} color="text.primary">
											{date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
										</Typography>
										<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
											{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
										</Typography>
									</TableCell>
									<TableCell>
										{movement.type === 'entry' && (
											<Typography variant="body2" fontWeight={500} color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
												<AddCircleOutlineIcon fontSize="small" /> Entrada
											</Typography>
										)}
										{movement.type === 'exit' && (
											<Typography variant="body2" fontWeight={500} color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
												<RemoveCircleOutlineIcon fontSize="small" /> Salida
											</Typography>
										)}
										{(movement.type as string) === 'transfer' && (
											<Typography variant="body2" fontWeight={500} color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
												<CompareArrowsIcon fontSize="small" /> Traspaso
											</Typography>
										)}
									</TableCell>
									<TableCell className="text-center">
										<Typography variant="body2" fontWeight={700} color="text.primary">
											{movement.type === 'entry' ? '+' : '-'}{movement.quantity}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip
											size="small"
											label={formatReason(movement.reason)}
											variant="outlined"
											sx={{ height: 20, fontSize: '0.7rem' }}
										/>
									</TableCell>
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{movement.user?.name || 'Sistema'}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{movement.destination_store?.name || 'N/A'}
										</Typography>
									</TableCell>
									<TableCell className="max-w-[200px] truncate" title={movement.notes || ''}>
										<Typography variant="body2" color="text.secondary" noWrap>
											{movement.notes || '-'}
										</Typography>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Box>

			{meta && meta.last_page > 1 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
					<Pagination
						count={meta.last_page}
						page={page}
						onChange={handlePageChange}
						color="primary"
						size="small"
					/>
				</Box>
			)}
		</Box>
	);
}
