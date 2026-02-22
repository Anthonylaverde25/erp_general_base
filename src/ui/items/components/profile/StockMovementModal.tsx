import { useState, useEffect, useMemo } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	MenuItem,
	Box,
	Typography,
	CircularProgress
} from '@mui/material';
import { Inventory2, AccessTime } from '@mui/icons-material';
import { useAdjustStockEntry } from '@/features/items/hooks/useAdjustStockEntry';
import useIndexStores from '@/features/stores/hooks/useIndexStores';
import useActiveCompany from '@/features/companies/useActiveCompany';

interface StockMovementModalProps {
	open: boolean;
	onClose: () => void;
	itemId: number;
	itemName: string;
	totalStock?: number;
	inventoryStocks?: { store_id: number; quantity_on_hand: number }[];
}

export default function StockMovementModal({
	open,
	onClose,
	itemId,
	itemName,
	totalStock,
	inventoryStocks = []
}: StockMovementModalProps) {
	const { handleAdjustStockEntry, isLoading } = useAdjustStockEntry();
	const { stores, isLoading: storesLoading } = useIndexStores();
	const activeCompany = useActiveCompany();

	const [quantity, setQuantity] = useState<string>('');
	const [storeId, setStoreId] = useState<string>('');

	const [notes, setNotes] = useState<string>('');
	const [currentTime, setCurrentTime] = useState<Date>(new Date());

	// Pre-seleccionar almacén por defecto de la empresa
	useEffect(() => {
		if (!storeId && activeCompany?.settings?.defaultStoreId) {
			setStoreId(String(activeCompany.settings.defaultStoreId));
		}
	}, [activeCompany?.settings?.defaultStoreId, storeId]);

	// Actualizar reloj en tiempo real
	useEffect(() => {
		if (!open) return;

		const interval = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, [open]);

	// Stock del almacén seleccionado
	const storeStock = useMemo(() => {
		if (!storeId) return null;

		const found = inventoryStocks.find((s) => s.store_id === Number(storeId));
		return found ? found.quantity_on_hand : 0;
	}, [storeId, inventoryStocks]);

	const handleSubmit = async () => {
		if (!quantity || !storeId) return;

		await handleAdjustStockEntry({
			item_id: itemId,
			destination_store_id: Number(storeId),
			quantity: Number(quantity),

			notes: notes || null,
			client_timestamp: new Date().toISOString()
		});

		handleClose();
	};

	const handleClose = () => {
		setQuantity('');
		setStoreId('');

		setNotes('');
		onClose();
	};

	// Resetear storeId al abrir para que aplique el default
	useEffect(() => {
		if (open && activeCompany?.settings?.defaultStoreId) {
			setStoreId(String(activeCompany.settings.defaultStoreId));
		}
	}, [open, activeCompany?.settings?.defaultStoreId]);

	const isValid = Number(quantity) > 0 && storeId;

	const formatDateTime = (date: Date) => {
		return date.toLocaleString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2
				}
			}}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					pb: 1,
					borderBottom: '1px solid',
					borderColor: 'divider'
				}}
			>
				<Inventory2 sx={{ color: 'primary.main', fontSize: 22 }} />
				<Box>
					<Typography
						variant="subtitle1"
						fontWeight={700}
					>
						Agregar Stock
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						{itemName}
					</Typography>
				</Box>
			</DialogTitle>
			<DialogContent sx={{ pt: 2.5, pb: 1 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
					{/* Información de stock */}
					<Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Stock Total:{' '}
							<Typography
								component="span"
								fontWeight={600}
								color="text.primary"
							>
								{totalStock ?? '—'}
							</Typography>
						</Typography>
						{storeId && (
							<Typography
								variant="body2"
								color="text.secondary"
							>
								En almacén:{' '}
								<Typography
									component="span"
									fontWeight={600}
									color="text.primary"
								>
									{storeStock ?? 0}
								</Typography>
							</Typography>
						)}
					</Box>

					{/* Fecha de movimiento (no editable) */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							p: 1,
							bgcolor: 'grey.50',
							borderRadius: 1,
							border: '1px solid',
							borderColor: 'divider'
						}}
					>
						<AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
						<Box>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Fecha de movimiento
							</Typography>
							<Typography
								variant="body2"
								fontWeight={600}
							>
								{formatDateTime(currentTime)}
							</Typography>
						</Box>
					</Box>

					<TextField
						select
						label="Almacén de destino"
						variant="filled"
						fullWidth
						value={storeId}
						onChange={(e) => setStoreId(e.target.value)}
						disabled={storesLoading}
					>
						{stores?.map((store) => (
							<MenuItem
								key={store.id}
								value={store.id}
							>
								{store.name}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label="Cantidad"
						type="number"
						variant="filled"
						fullWidth
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						inputProps={{ min: 0.0001, step: 1 }}
					/>

					<TextField
						label="Observaciones"
						variant="filled"
						fullWidth
						multiline
						rows={2}
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Opcional: describe el motivo del ajuste..."
					/>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
				<Button
					onClick={handleClose}
					size="small"
					color="inherit"
					sx={{ textTransform: 'none', fontWeight: 600 }}
				>
					Cancelar
				</Button>
				<Button
					onClick={handleSubmit}
					size="small"
					variant="contained"
					disabled={!isValid || isLoading}
					sx={{
						textTransform: 'none',
						fontWeight: 600,
						bgcolor: '#1b1b1b',
						'&:hover': { bgcolor: '#333' }
					}}
					startIcon={
						isLoading ? (
							<CircularProgress
								size={16}
								color="inherit"
							/>
						) : (
							<Inventory2 sx={{ fontSize: 16 }} />
						)
					}
				>
					{isLoading ? 'Registrando...' : 'Registrar entrada'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
