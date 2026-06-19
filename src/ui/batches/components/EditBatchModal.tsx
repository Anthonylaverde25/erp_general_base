import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Typography,
	IconButton,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	CircularProgress,
	Divider
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO, isValid } from 'date-fns';
import { BatchEntity } from '@/domain/entities/batches/BatchEntity';
import { useUpdateBatch } from '@/features/batches/hooks/useUpdateBatch';

interface EditBatchModalProps {
	open: boolean;
	onClose: () => void;
	batch: BatchEntity | null;
}

export default function EditBatchModal({ open, onClose, batch }: EditBatchModalProps) {
	const { handleUpdateBatch, isLoading } = useUpdateBatch();

	const [supplierBatchNumber, setSupplierBatchNumber] = useState('');
	const [manufacturedDate, setManufacturedDate] = useState<string | null>(null);
	const [expiryDate, setExpiryDate] = useState<string | null>(null);
	const [status, setStatus] = useState<'active' | 'quarantine' | 'expired'>('active');

	useEffect(() => {
		if (batch) {
			setSupplierBatchNumber(batch.supplier_batch_number || '');
			setManufacturedDate(batch.manufactured_date);
			setExpiryDate(batch.expiry_date);
			setStatus(batch.status);
		}
	}, [batch, open]);

	if (!batch) return null;

	const handleSave = async () => {
		try {
			await handleUpdateBatch({
				id: batch.id,
				data: {
					supplier_batch_number: supplierBatchNumber || null,
					manufactured_date: manufacturedDate,
					expiry_date: expiryDate,
					status
				}
			});
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 0,
					borderTop: '4px solid #005483',
					bgcolor: 'background.paper'
				}
			}}
		>
			{/* Header */}
			<DialogTitle
				sx={{
					p: 3,
					borderBottom: '1px solid',
					borderColor: 'divider',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<Box>
					<Typography variant="subtitle1" fontWeight={800} sx={{ fontSize: '1rem', color: 'text.primary' }}>
						Editar Metadatos de Lote
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Lote Interno: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{batch.internal_batch_number}</span>
					</Typography>
				</Box>
				<IconButton onClick={onClose} size="small" disabled={isLoading}>
					<Close fontSize="small" />
				</IconButton>
			</DialogTitle>

			{/* Body */}
			<DialogContent
				sx={{
					p: 3,
					pt: 3,
					display: 'flex',
					flexDirection: 'column',
					gap: 3
				}}
			>
				{/* Item Card Details */}
				<Box
					sx={{
						p: 2.5,
						border: '1px solid',
						borderColor: 'divider',
						bgcolor: 'background.default',
						borderRadius: 0,
						borderLeft: '4px solid #005483',
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
						mt: 1
					}}
				>
					<Typography variant="caption" color="text.secondary" fontWeight={600}>
						ARTÍCULO / PRODUCTO
					</Typography>
					<Typography variant="body2" fontWeight={750} sx={{ fontSize: '0.875rem' }}>
						{batch.item_name || 'N/A'}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						SKU: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{batch.item_sku || 'N/A'}</span>
					</Typography>
					<Divider sx={{ my: 0.5 }} />
					<Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
						<Typography variant="caption" color="text.secondary">
							Stock del Lote: <b>{batch.current_stock ?? 0} uds</b>
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Proveedor: <b>{batch.partner_name || 'Producción Propia'}</b>
						</Typography>
					</Box>
				</Box>

				{/* Form Fields */}
				<TextField
					label="Número de Lote del Proveedor"
					value={supplierBatchNumber}
					onChange={(e) => setSupplierBatchNumber(e.target.value)}
					size="small"
					fullWidth
					placeholder="Ej. B-99884-X"
					variant="outlined"
					InputProps={{
						sx: { borderRadius: 0 }
					}}
				/>

				<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
					<Box sx={{ flex: '1 1 200px' }}>
						<DatePicker
							label="Fecha de Fabricación"
							value={manufacturedDate ? parseISO(manufacturedDate) : null}
							onChange={(newValue: Date | null) => {
								if (newValue && isValid(newValue)) {
									setManufacturedDate(format(newValue, 'yyyy-MM-dd'));
								} else {
									setManufacturedDate(null);
								}
							}}
							format="dd/MM/yyyy"
							slotProps={{
								textField: {
									size: 'small',
									fullWidth: true,
									InputProps: {
										sx: { borderRadius: 0 }
									}
								}
							}}
						/>
					</Box>

					<Box sx={{ flex: '1 1 200px' }}>
						<DatePicker
							label="Fecha de Vencimiento"
							value={expiryDate ? parseISO(expiryDate) : null}
							onChange={(newValue: Date | null) => {
								if (newValue && isValid(newValue)) {
									setExpiryDate(format(newValue, 'yyyy-MM-dd'));
								} else {
									setExpiryDate(null);
								}
							}}
							format="dd/MM/yyyy"
							slotProps={{
								textField: {
									size: 'small',
									fullWidth: true,
									InputProps: {
										sx: { borderRadius: 0 }
									}
								}
							}}
						/>
					</Box>
				</Box>

				<FormControl size="small" fullWidth>
					<InputLabel id="batch-status-label">Estado del Lote</InputLabel>
					<Select
						labelId="batch-status-label"
						id="batch-status"
						value={status}
						label="Estado del Lote"
						onChange={(e) => setStatus(e.target.value as any)}
						sx={{ borderRadius: 0 }}
					>
						<MenuItem value="active">Activo (Disponible)</MenuItem>
						<MenuItem value="quarantine">Cuarentena (Retenido)</MenuItem>
						<MenuItem value="expired">Expirado (Vencido)</MenuItem>
					</Select>
				</FormControl>
			</DialogContent>

			{/* Footer */}
			<DialogActions
				sx={{
					p: 3,
					borderTop: '1px solid',
					borderColor: 'divider',
					display: 'flex',
					justifyContent: 'end',
					gap: 2
				}}
			>
				<Button
					variant="outlined"
					size="small"
					onClick={onClose}
					disabled={isLoading}
					sx={{ borderRadius: 0, minWidth: 90 }}
				>
					Cancelar
				</Button>
				<Button
					variant="contained"
					color="primary"
					size="small"
					onClick={handleSave}
					disabled={isLoading}
					sx={{
						borderRadius: 0,
						minWidth: 120,
						bgcolor: '#005483',
						'&:hover': {
							bgcolor: '#004064'
						}
					}}
					startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
				>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
