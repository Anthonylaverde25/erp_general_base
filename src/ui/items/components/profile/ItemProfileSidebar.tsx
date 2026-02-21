import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Add,
	Edit,
	History,
	NotificationsActive,
	PersonAddAlt1,
	Save
} from '@mui/icons-material';
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	MenuItem,
	Paper,
	Switch,
	TextField,
	Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import { useUpdateItem } from '@/features/items/hooks/useUpdateItem';
import { useUpdateStockAlert } from '@/features/items/hooks/useUpdateStockAlert';
import { useIndexSupplierPartners } from '@/features/partners/hooks/useIndexSupplierPartners';

interface ItemProfileSidebarProps {
	item: ItemEntity;
}

function Metric({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
			<Typography sx={{ fontSize: 11, fontWeight: 600, color: '#666' }}>{label}</Typography>
			<Typography sx={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: valueColor || '#1b1b1b' }}>
				{value}
			</Typography>
		</Box>
	);
}

export default function ItemProfileSidebar({ item }: ItemProfileSidebarProps) {
	const navigate = useNavigate();
	const { handleUpdateItem, isLoading: isUpdating } = useUpdateItem();
	const { handleUpdateStockAlert, isLoading: isUpdatingAlert } = useUpdateStockAlert();
	const { data: suppliers = [] } = useIndexSupplierPartners();

	const [historyOpen, setHistoryOpen] = useState(false);
	const [alarmOpen, setAlarmOpen] = useState(false);
	const [noteOpen, setNoteOpen] = useState(false);
	const [supplierOpen, setSupplierOpen] = useState(false);

	const [alarmEnabled, setAlarmEnabled] = useState(false);
	const [minStockAlert, setMinStockAlert] = useState('');
	const [noteText, setNoteText] = useState('');
	const [supplierId, setSupplierId] = useState<string>('');

	// Sync alarm state from item data
	useEffect(() => {
		setAlarmEnabled(item.physical_profile?.has_stock_alert ?? false);
		setMinStockAlert(
			item.physical_profile?.stock_min != null
				? String(item.physical_profile.stock_min)
				: ''
		);
	}, [item.physical_profile?.has_stock_alert, item.physical_profile?.stock_min]);

	useEffect(() => {
		setSupplierId(item.partner_id != null ? String(item.partner_id) : '');
	}, [item.partner_id]);

	const purchasePrice = item.purchase_price ?? 0;
	const salePrice = item.sale_price ?? 0;
	const margin = purchasePrice > 0 ? ((salePrice - purchasePrice) / purchasePrice) * 100 : 0;
	const totalAvailable = item.inventory.reduce(
		(total, inventoryItem) => total + (inventoryItem.available_quantity || 0),
		0
	);

	const selectedSupplierName = useMemo(() => {
		if (item.partner_name) {
			return item.partner_name;
		}

		if (item.partner_id == null) {
			return null;
		}

		return suppliers.find((supplier) => supplier.id === item.partner_id)?.name || null;
	}, [item.partner_id, item.partner_name, suppliers]);

	const actionBtnSx = {
		flex: '1 1 auto',
		textTransform: 'none',
		justifyContent: 'center',
		fontWeight: 600,
		fontSize: '0.8rem',
		color: 'text.primary',
		borderRadius: 0.5,
		py: 0.5,
		borderColor: 'divider',
		'&:hover': { bgcolor: 'action.hover', borderColor: 'divider' }
	} as const;

	const handleSaveSupplier = async () => {
		await handleUpdateItem({
			id: item.id,
			data: { partner_id: supplierId ? Number(supplierId) : null }
		});
		setSupplierOpen(false);
	};

	const handleSaveStockAlert = async () => {
		await handleUpdateStockAlert({
			id: item.id,
			data: {
				has_stock_alert: alarmEnabled,
				stock_min: minStockAlert !== '' ? Number(minStockAlert) : null
			}
		});
		setAlarmOpen(false);
	};

	return (
		<>
			<Box
				sx={{
					width: { xs: '100%', md: 360 },
					flexShrink: 0,
					borderRight: { xs: 0, md: 1 },
					borderBottom: { xs: 1, md: 0 },
					borderColor: '#E6EAF0 !important',
					p: 3,
					overflowY: { xs: 'visible', md: 'auto' },
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<Box className="mb-2 flex flex-wrap gap-2">
					<Button
						size="small"
						variant="outlined"
						color="inherit"
						startIcon={<Edit sx={{ fontSize: 16 }} />}
						sx={actionBtnSx}
						onClick={() => navigate(`/items/${item.id}/edit`)}
					>
						Editar
					</Button>
					<Button
						size="small"
						variant="outlined"
						color="inherit"
						startIcon={<History sx={{ fontSize: 16 }} />}
						sx={actionBtnSx}
						onClick={() => setHistoryOpen(true)}
					>
						Historial
					</Button>
					<Button
						size="small"
						variant="outlined"
						color="inherit"
						startIcon={<NotificationsActive sx={{ fontSize: 16 }} />}
						sx={actionBtnSx}
						onClick={() => setAlarmOpen(true)}
					>
						Alarma
					</Button>
					<Button
						size="small"
						variant="outlined"
						color="inherit"
						startIcon={<Add sx={{ fontSize: 16 }} />}
						sx={actionBtnSx}
						onClick={() => setNoteOpen(true)}
					>
						Nota
					</Button>
				</Box>

				<Divider sx={{ my: 2, borderColor: 'divider' }} />

				<Paper
					elevation={0}
					variant="outlined"
					sx={{
						height: 62,
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						px: 2,
						borderRadius: '8px',
						bgcolor: 'whitesmoke',
						mb: 1.5,
						borderColor: 'divider'
					}}
				>
					<Metric
						label="Compra"
						value={`$${Math.round(purchasePrice).toLocaleString('en-US')}`}
					/>
					<Divider
						orientation="vertical"
						flexItem
					/>
					<Metric
						label="Venta"
						value={`$${Math.round(salePrice).toLocaleString('en-US')}`}
						valueColor="#1D4ED8"
					/>
					<Divider
						orientation="vertical"
						flexItem
					/>
					<Metric
						label="Margen"
						value={`${margin.toFixed(1)}%`}
						valueColor="#004D1A"
					/>
				</Paper>

				<Paper
					elevation={0}
					variant="outlined"
					sx={{ borderRadius: '14px', p: 2, mb: 1.5, borderColor: 'divider' }}
				>
					<Typography sx={{ fontSize: 13, fontWeight: 600, color: '#666', mb: 1 }}>
						Proveedor
					</Typography>
					{selectedSupplierName ? (
						<Chip
							label={selectedSupplierName}
							size="small"
							color="success"
							variant="outlined"
							sx={{ mb: 1.25 }}
						/>
					) : (
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: 'block', mb: 1.25 }}
						>
							No aplica / Sin proveedor asignado
						</Typography>
					)}
					<Button
						fullWidth
						variant="outlined"
						startIcon={<PersonAddAlt1 />}
						sx={{ textTransform: 'none', fontWeight: 600 }}
						onClick={() => setSupplierOpen(true)}
					>
						{selectedSupplierName ? 'Cambiar proveedor' : 'Asignar proveedor'}
					</Button>
				</Paper>

				<Paper
					elevation={0}
					variant="outlined"
					sx={{ borderRadius: '14px', p: 2, mb: 1.5, borderColor: 'divider' }}
				>
					<Typography sx={{ fontSize: 13, fontWeight: 600, color: '#666', mb: 1 }}>
						Inventario por almacén
					</Typography>
					<Typography sx={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#004D1A', mb: 1 }}>
						Total disponible: {totalAvailable}
					</Typography>
					{item.inventory.length > 0 ? (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
							{item.inventory.map((inventoryItem) => (
								<Box
									key={inventoryItem.id}
									className="flex items-center justify-between"
								>
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ fontSize: '0.75rem' }}
									>
										{inventoryItem.store_name}
									</Typography>
									<Typography
										variant="body2"
										fontWeight={700}
										sx={{ fontSize: '0.85rem' }}
									>
										{inventoryItem.available_quantity}
									</Typography>
								</Box>
							))}
						</Box>
					) : (
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Sin movimientos de inventario registrados.
						</Typography>
					)}
				</Paper>

				<Box sx={{ flex: 1 }} />
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					<Button
						fullWidth
						variant="contained"
						sx={{ textTransform: 'none', fontWeight: 600 }}
					>
						Ver ficha tecnica
						<FuseSvgIcon
							sx={{ ml: 1 }}
							size={16}
						>
							heroicons-outline:document-text
						</FuseSvgIcon>
					</Button>
					<Button
						fullWidth
						variant="outlined"
						color="inherit"
						sx={{ textTransform: 'none', fontWeight: 600 }}
					>
						Crear presupuesto
						<FuseSvgIcon
							sx={{ ml: 1 }}
							size={16}
						>
							heroicons-outline:document-plus
						</FuseSvgIcon>
					</Button>
					<Button
						fullWidth
						variant="outlined"
						color="inherit"
						sx={{ textTransform: 'none', fontWeight: 600 }}
						onClick={() => setNoteOpen(true)}
					>
						Agregar nota
						<FuseSvgIcon
							sx={{ ml: 1 }}
							size={16}
						>
							heroicons-outline:pencil-square
						</FuseSvgIcon>
					</Button>
				</Box>
			</Box>

			<Dialog
				open={historyOpen}
				onClose={() => setHistoryOpen(false)}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Historial del artículo</DialogTitle>
				<DialogContent dividers>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
						{item.inventory.map((inventoryItem) => (
							<Paper
								key={inventoryItem.id}
								variant="outlined"
								sx={{ p: 1.5, borderRadius: 1.5 }}
							>
								<Typography
									variant="body2"
									fontWeight={700}
								>
									{inventoryItem.store_name}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									Disponible: {inventoryItem.available_quantity} · En stock: {inventoryItem.quantity_on_hand}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ display: 'block', mt: 0.75 }}
								>
									Último conteo: {inventoryItem.last_count_at ? new Date(inventoryItem.last_count_at).toLocaleString('es-ES') : 'N/A'}
								</Typography>
							</Paper>
						))}
						{item.inventory.length === 0 && (
							<Typography color="text.secondary">No hay historial de inventario disponible.</Typography>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setHistoryOpen(false)}>Cerrar</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={alarmOpen}
				onClose={() => setAlarmOpen(false)}
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle>Configurar alarma de stock</DialogTitle>
				<DialogContent dividers>
					<FormControlLabel
						control={
							<Switch
								checked={alarmEnabled}
								onChange={(event) => setAlarmEnabled(event.target.checked)}
							/>
						}
						label="Activar alerta"
					/>
					<TextField
						fullWidth
						size="small"
						label="Stock mínimo"
						type="number"
						value={minStockAlert}
						onChange={(event) => setMinStockAlert(event.target.value)}
						disabled={!alarmEnabled}
						sx={{ mt: 1.5 }}
					/>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 1, display: 'block' }}
					>
						Diseño de alerta listo para conectar notificaciones por email/webhook.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setAlarmOpen(false)}>Cancelar</Button>
					<Button
						variant="contained"
						onClick={handleSaveStockAlert}
						disabled={isUpdatingAlert}
					>
						{isUpdatingAlert ? 'Guardando...' : 'Guardar'}
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={noteOpen}
				onClose={() => setNoteOpen(false)}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Agregar nota</DialogTitle>
				<DialogContent dividers>
					<TextField
						fullWidth
						multiline
						rows={5}
						label="Nota interna"
						placeholder="Escribe una nota para este artículo..."
						value={noteText}
						onChange={(event) => setNoteText(event.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setNoteOpen(false)}>Cancelar</Button>
					<Button
						variant="contained"
						startIcon={<Save />}
						onClick={() => {
							setNoteOpen(false);
							setNoteText('');
						}}
					>
						Guardar nota
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={supplierOpen}
				onClose={() => setSupplierOpen(false)}
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle>Asignar proveedor</DialogTitle>
				<DialogContent dividers>
					<TextField
						fullWidth
						select
						size="small"
						label="Proveedor"
						value={supplierId}
						onChange={(event) => setSupplierId(event.target.value)}
					>
						<MenuItem value="">
							<em>Sin proveedor</em>
						</MenuItem>
						{suppliers.map((supplier) => (
							<MenuItem
								key={supplier.id}
								value={String(supplier.id)}
							>
								{supplier.name}
							</MenuItem>
						))}
					</TextField>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 1.25, display: 'block' }}
					>
						Puedes asignar proveedor o dejarlo sin aplicar para este ítem.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSupplierOpen(false)}>Cancelar</Button>
					<Button
						variant="contained"
						onClick={handleSaveSupplier}
						disabled={isUpdating}
					>
						{isUpdating ? 'Guardando...' : 'Guardar proveedor'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
