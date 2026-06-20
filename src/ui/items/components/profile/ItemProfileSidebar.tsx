import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Add, Edit, History, NotificationsActive, PersonAddAlt1, Save, Star, StarBorder } from '@mui/icons-material';
import {
	Autocomplete,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	IconButton,
	Paper,
	Switch,
	TextField,
	Tooltip,
	Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
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
	const [selectedPartnerIds, setSelectedPartnerIds] = useState<number[]>([]);
	const [defaultPartnerId, setDefaultPartnerId] = useState<number | null>(null);

	// Sync alarm state from item data
	useEffect(() => {
		setAlarmEnabled(item.physical_profile?.has_stock_alert ?? false);
		setMinStockAlert(item.physical_profile?.stock_min != null ? String(item.physical_profile.stock_min) : '');
	}, [item.physical_profile?.has_stock_alert, item.physical_profile?.stock_min]);

	useEffect(() => {
		if ((item.partners || []).length > 0) {
			setSelectedPartnerIds((item.partners || []).map((p) => p.id));
			const defaultP = (item.partners || []).find((p) => p.is_default);
			setDefaultPartnerId(defaultP?.id ?? item.partners?.[0]?.id ?? null);
		} else if (item.partner_id) {
			setSelectedPartnerIds([item.partner_id]);
			setDefaultPartnerId(item.partner_id);
		} else {
			setSelectedPartnerIds([]);
			setDefaultPartnerId(null);
		}
	}, [item.partner_id, item.partners]);

	const purchasePrice = item.purchase_price ?? 0;
	const salePrice = item.sale_price ?? 0;
	const margin = purchasePrice > 0 ? ((salePrice - purchasePrice) / purchasePrice) * 100 : 0;
	const totalAvailable = (item.inventory || []).reduce(
		(total, inventoryItem) => total + (inventoryItem.available_quantity || 0),
		0
	);

	const actionBtnSx = {
		flex: '1 1 auto',
		textTransform: 'none',
		justifyContent: 'center',
		fontWeight: 600,
		fontSize: '0.75rem',
		color: 'text.secondary',
		py: 0.5,
		px: 1.5,
		borderRadius: 0.5,
		border: '1px solid',
		borderColor: 'divider',
		bgcolor: 'transparent',
		'&:hover': {
			bgcolor: 'action.hover',
			color: 'text.primary',
			borderColor: 'divider'
		}
	} as const;

	const handleSaveSupplier = async () => {
		// Reorder so default is first
		const orderedIds = defaultPartnerId
			? [defaultPartnerId, ...selectedPartnerIds.filter((id) => id !== defaultPartnerId)]
			: selectedPartnerIds;
		await handleUpdateItem({
			id: item.id,
			data: { partner_ids: orderedIds }
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
						color="inherit"
						startIcon={<Edit sx={{ fontSize: 16 }} />}
						sx={actionBtnSx}
						onClick={() => navigate(`/items/${item.id}/edit`)}
					>
						Editar
					</Button>
					<Button
						size="small"
						color="inherit"
						startIcon={<History sx={{ fontSize: 16 }} />}
						sx={actionBtnSx}
						onClick={() => setHistoryOpen(true)}
					>
						Historial
					</Button>
					<Button
						size="small"
						color="inherit"
						startIcon={<NotificationsActive sx={{ fontSize: 16 }} />}
						sx={actionBtnSx}
						onClick={() => setAlarmOpen(true)}
					>
						Alarma
					</Button>
					<Button
						size="small"
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
					<Typography sx={{ fontSize: 13, fontWeight: 600, color: '#666', mb: 1 }}>Proveedores</Typography>
					{item.partners.length > 0 ? (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.25 }}>
							{item.partners.map((partner) => (
								<Box
									key={partner.id}
									className="flex items-center gap-1"
								>
									<Chip
										label={partner.name}
										size="small"
										color={partner.is_default ? 'primary' : 'default'}
										variant={partner.is_default ? 'filled' : 'outlined'}
										icon={partner.is_default ? <Star sx={{ fontSize: 14 }} /> : undefined}
									/>
									{partner.is_default && (
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{ fontSize: '0.7rem' }}
										>
											Por defecto
										</Typography>
									)}
								</Box>
							))}
						</Box>
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
						color="inherit"
						startIcon={<PersonAddAlt1 />}
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							fontSize: '0.75rem',
							color: 'text.secondary',
							py: 0.5,
							px: 1.5,
							borderRadius: 0.5,
							borderColor: 'divider',
							bgcolor: 'transparent',
							'&:hover': {
								bgcolor: 'action.hover',
								color: 'text.primary',
								borderColor: 'divider'
							}
						}}
						onClick={() => setSupplierOpen(true)}
					>
						{item.partners.length > 0 ? 'Gestionar proveedores' : 'Asignar proveedor'}
					</Button>
				</Paper>

				<Paper
					elevation={0}
					variant="outlined"
					sx={{ borderRadius: '14px', p: 2, mb: 1.5, borderColor: 'divider' }}
				>
					<Typography sx={{ fontSize: 13, fontWeight: 600, color: '#666', mb: 1 }}>Stock total</Typography>
					<Typography
						sx={{
							fontFamily: 'monospace',
							fontSize: 22,
							fontWeight: 700,
							color: totalAvailable > 0 ? '#004D1A' : '#B71C1C',
							mb: 1
						}}
					>
						{totalAvailable} {item.unit_name || 'uds'}
					</Typography>
					{item.physical_profile?.stock_min != null && (
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ display: 'block', mb: 1.25 }}
						>
							Stock mínimo: {item.physical_profile.stock_min}
						</Typography>
					)}
				</Paper>

				<Box sx={{ flex: 1 }} />
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					<Button
						fullWidth
						variant="outlined"
						color="inherit"
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							fontSize: '0.75rem',
							color: 'text.secondary',
							py: 0.5,
							px: 1.5,
							borderRadius: 0.5,
							borderColor: 'divider',
							bgcolor: 'transparent',
							justifyContent: 'flex-start',
							'&:hover': {
								bgcolor: 'action.hover',
								color: 'text.primary',
								borderColor: 'text.secondary'
							}
						}}
						startIcon={<FuseSvgIcon size={18}>heroicons-outline:document-text</FuseSvgIcon>}
					>
						Ver ficha tecnica
					</Button>
					<Button
						fullWidth
						variant="outlined"
						color="inherit"
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							fontSize: '0.75rem',
							color: 'text.secondary',
							py: 0.5,
							px: 1.5,
							borderRadius: 0.5,
							borderColor: 'divider',
							bgcolor: 'transparent',
							justifyContent: 'flex-start',
							'&:hover': {
								bgcolor: 'action.hover',
								color: 'text.primary',
								borderColor: 'text.secondary'
							}
						}}
						startIcon={<FuseSvgIcon size={18}>heroicons-outline:document-plus</FuseSvgIcon>}
					>
						Crear presupuesto
					</Button>
					<Button
						fullWidth
						variant="outlined"
						color="inherit"
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							fontSize: '0.75rem',
							color: 'text.secondary',
							py: 0.5,
							px: 1.5,
							borderRadius: 0.5,
							borderColor: 'divider',
							bgcolor: 'transparent',
							justifyContent: 'flex-start',
							'&:hover': {
								bgcolor: 'action.hover',
								color: 'text.primary',
								borderColor: 'text.secondary'
							}
						}}
						startIcon={<FuseSvgIcon size={18}>heroicons-outline:pencil-square</FuseSvgIcon>}
						onClick={() => setNoteOpen(true)}
					>
						Agregar nota
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
									Disponible: {inventoryItem.available_quantity} · En stock:{' '}
									{inventoryItem.quantity_on_hand}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ display: 'block', mt: 0.75 }}
								>
									Último conteo:{' '}
									{inventoryItem.last_count_at
										? new Date(inventoryItem.last_count_at).toLocaleString('es-ES')
										: 'N/A'}
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
				maxWidth="sm"
			>
				<DialogTitle>Gestionar proveedores</DialogTitle>
				<DialogContent dividers>
					<Autocomplete
						multiple
						disablePortal
						options={suppliers}
						getOptionLabel={(option) => option.name}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						value={suppliers.filter((s) => selectedPartnerIds.includes(s.id))}
						onChange={(_, newValue) => {
							const newIds = newValue.map((s) => s.id);
							setSelectedPartnerIds(newIds);

							// If default was removed or is not set, set first as default
							if (!defaultPartnerId || !newIds.includes(defaultPartnerId)) {
								setDefaultPartnerId(newIds[0] ?? null);
							}
						}}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip
									{...getTagProps({ index })}
									key={option.id}
									label={option.name}
									size="small"
									color={defaultPartnerId === option.id ? 'primary' : 'default'}
									variant={defaultPartnerId === option.id ? 'filled' : 'outlined'}
								/>
							))
						}
						renderInput={(params) => (
							<TextField
								{...params}
								size="small"
								label="Proveedores"
								placeholder="Buscar proveedor..."
							/>
						)}
					/>

					{selectedPartnerIds.length > 0 && (
						<Box sx={{ mt: 2 }}>
							<Typography
								variant="caption"
								fontWeight={600}
								color="text.secondary"
								sx={{ mb: 0.5, display: 'block' }}
							>
								Proveedor por defecto
							</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
								{selectedPartnerIds.map((pId) => {
									const partner = suppliers.find((s) => s.id === pId);

									if (!partner) return null;

									const isDefault = defaultPartnerId === pId;
									return (
										<Box
											key={pId}
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1,
												p: 1,
												borderRadius: 1,
												border: '1px solid',
												borderColor: isDefault ? 'primary.main' : 'divider',
												bgcolor: isDefault ? 'primary.50' : 'transparent'
											}}
										>
											<Tooltip
												title={
													isDefault ? 'Proveedor por defecto' : 'Marcar como predeterminado'
												}
											>
												<IconButton
													size="small"
													onClick={() => setDefaultPartnerId(pId)}
													color={isDefault ? 'primary' : 'default'}
												>
													{isDefault ? <Star /> : <StarBorder />}
												</IconButton>
											</Tooltip>
											<Typography
												variant="body2"
												fontWeight={isDefault ? 700 : 400}
											>
												{partner.name}
											</Typography>
											{isDefault && (
												<Chip
													label="Por defecto"
													size="small"
													color="primary"
													variant="outlined"
													sx={{ ml: 'auto' }}
												/>
											)}
										</Box>
									);
								})}
							</Box>
						</Box>
					)}

					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ mt: 1.25, display: 'block' }}
					>
						Selecciona uno o más proveedores y marca la ★ para elegir el proveedor por defecto.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSupplierOpen(false)}>Cancelar</Button>
					<Button
						variant="contained"
						onClick={handleSaveSupplier}
						disabled={isUpdating}
					>
						{isUpdating ? 'Guardando...' : 'Guardar proveedores'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
