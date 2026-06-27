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
	Divider,
	ButtonBase
} from '@mui/material';
import { Close, CheckCircle, Cancel } from '@mui/icons-material';
import { ItemSerialReturnEntity } from '@/domain/entities/serial-returns/ItemSerialReturnEntity';
import { useIndexItemReturnReasons } from '@/features/serial-returns/hooks/useIndexItemReturnReasons';
import { useProcessSerialReturn } from '@/features/serial-returns/hooks/useProcessSerialReturn';

interface InspectSerialModalProps {
	open: boolean;
	onClose: () => void;
	serialReturn: ItemSerialReturnEntity | null;
}

export default function InspectSerialModal({ open, onClose, serialReturn }: InspectSerialModalProps) {
	const { data: reasons = [], isLoading: loadingReasons } = useIndexItemReturnReasons();
	const { mutateAsync: processReturn, isPending: isProcessing } = useProcessSerialReturn();

	const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
	const [reasonId, setReasonId] = useState<number | ''>('');
	const [technicalNotes, setTechnicalNotes] = useState('');

	useEffect(() => {
		if (serialReturn) {
			setDecision(serialReturn.is_processed && serialReturn.item_serial?.status === 'damaged' ? 'reject' : 'approve');
			setReasonId(serialReturn.item_return_reason_id || '');
			setTechnicalNotes(serialReturn.technical_notes || '');
		}
	}, [serialReturn, open]);

	if (!serialReturn) return null;

	const handleSave = async () => {
		if (!reasonId) return;
		try {
			await processReturn({
				id: serialReturn.id,
				payload: {
					decision,
					item_return_reason_id: Number(reasonId),
					technical_notes: technicalNotes || null
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
						{serialReturn.is_processed ? 'Detalle de Inspección Técnica' : 'Inspección y Diagnóstico Técnico'}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						ID Retorno: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{serialReturn.id}</span>
					</Typography>
				</Box>
				<IconButton onClick={onClose} size="small" disabled={isProcessing}>
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
				{/* Item Information Card */}
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
						gap: 1.5,
						mt: 1
					}}
				>
					<Box>
						<Typography variant="caption" color="text.secondary" fontWeight={600}>
							ARTÍCULO / PRODUCTO
						</Typography>
						<Typography variant="body2" fontWeight={750} sx={{ fontSize: '0.875rem' }}>
							{serialReturn.item_serial?.item?.name || 'Artículo Desconocido'}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							SKU: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{serialReturn.item_serial?.item?.sku || 'N/A'}</span>
						</Typography>
					</Box>

					<Divider />

					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
						<Box>
							<Typography variant="caption" color="text.secondary" display="block">
								NÚMERO DE SERIAL
							</Typography>
							<Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
								{serialReturn.item_serial?.serial_number}
							</Typography>
						</Box>
						<Box>
							<Typography variant="caption" color="text.secondary" display="block">
								DOCUMENTO / NOTA DE CRÉDITO
							</Typography>
							<Typography variant="body2" fontWeight={600}>
								{serialReturn.document?.number_serie || `NC-ID: ${serialReturn.document_id}`}
							</Typography>
						</Box>
					</Box>

					<Divider />

					<Box>
						<Typography variant="caption" color="text.secondary" display="block">
							MOTIVO REPORTADO POR CLIENTE / NOTAS
						</Typography>
						<Typography variant="body2" color="text.primary" sx={{ fontStyle: serialReturn.customer_notes ? 'normal' : 'italic' }}>
							{serialReturn.customer_notes || 'Sin notas del cliente.'}
						</Typography>
					</Box>
				</Box>

				{/* Processing Section */}
				{!serialReturn.is_processed ? (
					<>
						<Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: -1.5 }}>
							Decisión Técnica
						</Typography>

						{/* Action Buttons for Decision */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							<ButtonBase
								onClick={() => setDecision('approve')}
								disabled={isProcessing}
								sx={{
									flex: 1,
									p: 2,
									border: '2px solid',
									borderColor: decision === 'approve' ? '#2e7d32' : 'divider',
									bgcolor: decision === 'approve' ? 'rgba(46, 125, 50, 0.04)' : 'transparent',
									borderRadius: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 1,
									transition: 'all 0.2s ease-in-out',
									'&:hover': {
										borderColor: decision === 'approve' ? '#2e7d32' : 'text.secondary',
										bgcolor: decision === 'approve' ? 'rgba(46, 125, 50, 0.08)' : 'rgba(0,0,0,0.02)'
									}
								}}
							>
								<CheckCircle sx={{ color: decision === 'approve' ? '#2e7d32' : 'text.disabled', fontSize: 32 }} />
								<Typography variant="body2" fontWeight={700} color={decision === 'approve' ? 'success.main' : 'text.primary'}>
									Aprobar Ingreso
								</Typography>
								<Typography variant="caption" color="text.secondary" align="center">
									El producto está en buen estado y volverá a estar <b>Disponible</b> para la venta.
								</Typography>
							</ButtonBase>

							<ButtonBase
								onClick={() => setDecision('reject')}
								disabled={isProcessing}
								sx={{
									flex: 1,
									p: 2,
									border: '2px solid',
									borderColor: decision === 'reject' ? '#d32f2f' : 'divider',
									bgcolor: decision === 'reject' ? 'rgba(211, 47, 47, 0.04)' : 'transparent',
									borderRadius: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 1,
									transition: 'all 0.2s ease-in-out',
									'&:hover': {
										borderColor: decision === 'reject' ? '#d32f2f' : 'text.secondary',
										bgcolor: decision === 'reject' ? 'rgba(211, 47, 47, 0.08)' : 'rgba(0,0,0,0.02)'
									}
								}}
							>
								<Cancel sx={{ color: decision === 'reject' ? '#d32f2f' : 'text.disabled', fontSize: 32 }} />
								<Typography variant="body2" fontWeight={700} color={decision === 'reject' ? 'error.main' : 'text.primary'}>
									Rechazar / Dañado
								</Typography>
								<Typography variant="caption" color="text.secondary" align="center">
									El producto presenta fallas físicas o daños. Se registrará como <b>Dañado</b>.
								</Typography>
							</ButtonBase>
						</Box>

						{/* Physical Return Reason Dropdown */}
						<FormControl size="small" fullWidth error={!reasonId}>
							<InputLabel id="return-reason-label">Motivo de la Devolución (Físico)</InputLabel>
							<Select
								labelId="return-reason-label"
								id="return-reason"
								value={reasonId}
								label="Motivo de la Devolución (Físico)"
								onChange={(e) => setReasonId(e.target.value as number)}
								disabled={loadingReasons || isProcessing}
								sx={{ borderRadius: 0 }}
							>
								{reasons
									.filter((r) => r.is_active)
									.map((r) => (
										<MenuItem key={r.id} value={r.id}>
											{r.name}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						{/* Technical Notes / Diagnosis */}
						<TextField
							label="Diagnóstico / Notas Técnicas"
							value={technicalNotes}
							onChange={(e) => setTechnicalNotes(e.target.value)}
							disabled={isProcessing}
							size="small"
							fullWidth
							multiline
							rows={3}
							placeholder="Detalles sobre el estado del equipo, pruebas realizadas, fallas detectadas..."
							variant="outlined"
							InputProps={{
								sx: { borderRadius: 0 }
							}}
						/>
					</>
				) : (
					/* Read-only view for already processed reviews */
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							{serialReturn.item_serial?.status === 'damaged' ? (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
									<Cancel />
									<Typography variant="subtitle2" fontWeight={700}>
										Rechazado (Registrado como Dañado)
									</Typography>
								</Box>
							) : (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
									<CheckCircle />
									<Typography variant="subtitle2" fontWeight={700}>
										Aprobado (Disponible para Venta)
									</Typography>
								</Box>
							)}
						</Box>

						<Box>
							<Typography variant="caption" color="text.secondary" display="block">
								MOTIVO DE DEVOLUCIÓN CONFIRMADO
							</Typography>
							<Typography variant="body2" fontWeight={600}>
								{serialReturn.reason?.name || 'No especificado'}
							</Typography>
						</Box>

						<Box>
							<Typography variant="caption" color="text.secondary" display="block">
								DIAGNÓSTICO TÉCNICO
							</Typography>
							<Typography variant="body2">
								{serialReturn.technical_notes || 'Sin diagnóstico técnico registrado.'}
							</Typography>
						</Box>

						<Divider />

						<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
							<Box>
								<Typography variant="caption" color="text.secondary" display="block">
									INSPECCIONADO POR
								</Typography>
								<Typography variant="body2" fontWeight={600}>
									{serialReturn.processed_by_user?.name || 'Sistema'}
								</Typography>
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary" display="block">
									FECHA DE INSPECCIÓN
								</Typography>
								<Typography variant="body2">
									{serialReturn.processed_at ? new Date(serialReturn.processed_at).toLocaleString() : 'N/A'}
								</Typography>
							</Box>
						</Box>
					</Box>
				)}
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
					disabled={isProcessing}
					sx={{ borderRadius: 0, minWidth: 90 }}
				>
					{serialReturn.is_processed ? 'Cerrar' : 'Cancelar'}
				</Button>
				{!serialReturn.is_processed && (
					<Button
						variant="contained"
						color="primary"
						size="small"
						onClick={handleSave}
						disabled={isProcessing || !reasonId}
						sx={{
							borderRadius: 0,
							minWidth: 120,
							bgcolor: '#005483',
							'&:hover': {
								bgcolor: '#004064'
							}
						}}
						startIcon={isProcessing ? <CircularProgress size={16} color="inherit" /> : null}
					>
						Guardar Diagnóstico
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
