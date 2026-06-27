import React, { useState, useEffect, useRef } from 'react';
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
	List,
	ListItem,
	ListItemText,
	CircularProgress,
	Divider,
	Alert
} from '@mui/material';
import { Close, Add, Delete, BarcodeReader } from '@mui/icons-material';
import { PendingSerializationItem } from '@/types/pending-serialization.types';
import { useRegisterItemSerials } from '@/features/pending-serialization/hooks/useRegisterItemSerials';

interface RegisterSerialsDialogProps {
	open: boolean;
	onClose: () => void;
	item: PendingSerializationItem | null;
}

export default function RegisterSerialsDialog({ open, onClose, item }: RegisterSerialsDialogProps) {
	const { mutateAsync: registerSerials, isPending: isSaving } = useRegisterItemSerials();

	const [serials, setSerials] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open && item) {
			setSerials([]);
			setInputValue('');
			setError(null);
			// Focus input field after dialog transitions open
			setTimeout(() => {
				inputRef.current?.focus();
			}, 150);
		}
	}, [open, item]);

	if (!item) return null;

	const requiredQty = item.pending_count;

	const handleAddSerial = (serial: string) => {
		const cleanSerial = serial.trim();
		if (!cleanSerial) return;

		setError(null);

		// Prevent duplicate serials in the current list
		if (serials.includes(cleanSerial)) {
			setError(`El número de serie "${cleanSerial}" ya está en la lista.`);
			return;
		}

		// Limit count to required quantity
		if (serials.length >= requiredQty) {
			setError(`Ya has ingresado la cantidad necesaria de series (${requiredQty}).`);
			return;
		}

		setSerials((prev) => [...prev, cleanSerial]);
		setInputValue('');

		// Re-focus input for continuous scanning
		setTimeout(() => {
			inputRef.current?.focus();
		}, 50);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddSerial(inputValue);
		}
	};

	const handleRemoveSerial = (index: number) => {
		setSerials((prev) => prev.filter((_, i) => i !== index));
		setError(null);
	};

	const handleSave = async () => {
		if (serials.length !== requiredQty) {
			setError(`Debe ingresar exactamente ${requiredQty} números de serie para continuar.`);
			return;
		}

		try {
			await registerSerials({
				id: item.id,
				payload: {
					store_id: item.store_id,
					serial_numbers: serials
				}
			});
			onClose();
		} catch (err) {
			console.error(err);
		}
	};

	const isComplete = serials.length === requiredQty;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
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
						Registrar Números de Serie
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Ingreso manual diferido de series
					</Typography>
				</Box>
				<IconButton onClick={onClose} size="small" disabled={isSaving}>
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
					gap: 2.5
				}}
			>
				{/* Info Card */}
				<Box
					sx={{
						p: 2,
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
					<Typography variant="body2" fontWeight={750}>
						{item.name}
					</Typography>
					<Typography variant="caption" color="text.secondary" display="block">
						SKU: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.sku}</span>
					</Typography>

					<Divider sx={{ my: 0.5 }} />

					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Box>
							<Typography variant="caption" color="text.secondary" display="block">
								ALMACÉN / BODEGA
							</Typography>
							<Typography variant="body2" fontWeight={600}>
								{item.store_name}
							</Typography>
						</Box>
						<Box sx={{ textAlign: 'right' }}>
							<Typography variant="caption" color="text.secondary" display="block">
								SERIES PENDIENTES
							</Typography>
							<Typography variant="body2" fontWeight={800} color="#005483">
								{requiredQty} Uds.
							</Typography>
						</Box>
					</Box>
				</Box>

				{error && (
					<Alert severity="error" sx={{ borderRadius: 0, py: 0.2 }}>
						{error}
					</Alert>
				)}

				{/* Input field */}
				<Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
					<TextField
						inputRef={inputRef}
						label="Escanear o escribir número de serie..."
						variant="outlined"
						size="small"
						fullWidth
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={isComplete || isSaving}
						placeholder={isComplete ? 'Completado' : 'Presione Enter para agregar'}
						InputProps={{
							sx: { borderRadius: 0 }
						}}
					/>
					<Button
						variant="contained"
						onClick={() => handleAddSerial(inputValue)}
						disabled={!inputValue.trim() || isComplete || isSaving}
						sx={{
							minWidth: 40,
							height: 40,
							borderRadius: 0,
							bgcolor: '#005483',
							'&:hover': { bgcolor: '#004064' }
						}}
					>
						<Add />
					</Button>
				</Box>

				{/* List */}
				<Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
						<Typography variant="caption" fontWeight={700} color="text.secondary">
							Series ingresadas ({serials.length} de {requiredQty})
						</Typography>
						{isComplete ? (
							<Typography variant="caption" color="success.main" fontWeight={800}>
								✓ Listo
							</Typography>
						) : (
							<Typography variant="caption" color="warning.main" fontWeight={800}>
								Faltan {requiredQty - serials.length}
							</Typography>
						)}
					</Box>

					<Box
						sx={{
							maxHeight: 180,
							overflowY: 'auto',
							border: '1px solid',
							borderColor: 'divider',
							bgcolor: 'background.paper',
							minHeight: '60px'
						}}
					>
						{serials.length === 0 ? (
							<Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
								<Typography variant="caption">No se han registrado series aún.</Typography>
							</Box>
						) : (
							<List dense disablePadding>
								{serials.map((serial, index) => (
									<ListItem
										key={index}
										divider={index < serials.length - 1}
										secondaryAction={
											<IconButton
												edge="end"
												size="small"
												onClick={() => handleRemoveSerial(index)}
												sx={{ color: 'error.main' }}
												disabled={isSaving}
											>
												<Delete fontSize="small" />
											</IconButton>
										}
										sx={{ py: 0.5, px: 2 }}
									>
										<ListItemText
											primary={serial}
											primaryTypographyProps={{
												fontSize: '12px',
												fontFamily: 'monospace',
												fontWeight: 600
											}}
										/>
									</ListItem>
								))}
							</List>
						)}
					</Box>
				</Box>
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
				<Button variant="outlined" size="small" onClick={onClose} disabled={isSaving} sx={{ borderRadius: 0 }}>
					Cancelar
				</Button>
				<Button
					variant="contained"
					color="primary"
					size="small"
					onClick={handleSave}
					disabled={isSaving || !isComplete}
					sx={{
						borderRadius: 0,
						minWidth: 120,
						bgcolor: '#005483',
						'&:hover': {
							bgcolor: '#004064'
						}
					}}
					startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
				>
					Registrar Series
				</Button>
			</DialogActions>
		</Dialog>
	);
}
