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
	ButtonBase,
	Alert
} from '@mui/material';
import { X, Save, CheckCircle2, XCircle } from 'lucide-react';
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
					bgcolor: 'background.paper',
					boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)'
				}
			}}
		>
			{/* Header */}
			<DialogTitle
				sx={{
					p: 3,
					pb: 2,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<Box>
					<Typography variant="subtitle1" fontWeight={750} sx={{ fontSize: '1.15rem', color: 'text.primary' }}>
						{serialReturn.is_processed ? 'Detalle de Inspección Técnica' : 'Inspección y Diagnóstico Técnico'}
					</Typography>
				</Box>
				<IconButton onClick={onClose} size="small" disabled={isProcessing} sx={{ color: '#4b5563' }}>
					<X size={20} />
				</IconButton>
			</DialogTitle>
			<Divider />

			{/* Body */}
			<DialogContent
				sx={{
					p: 3,
					display: 'flex',
					flexDirection: 'column',
					gap: 2.5
				}}
			>
				{/* Item Information Section */}
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, px: 0.5 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
						<Box sx={{ flex: 1, pr: 2 }}>
							<Typography
								variant="caption"
								sx={{
									color: '#6b7280',
									fontWeight: 700,
									fontSize: '0.6875rem',
									letterSpacing: '0.5px',
									textTransform: 'uppercase',
									display: 'block',
									mb: 0.5
								}}
							>
								Ítem en Inspección
							</Typography>
							<Typography
								variant="body2"
								fontWeight={750}
								sx={{
									color: 'text.primary',
									fontSize: '1rem',
									lineHeight: 1.3
								}}
							>
								{serialReturn.item_serial?.item?.name || 'Artículo Desconocido'}
							</Typography>
						</Box>
						
					</Box>

					<Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
						<Box>
							<Typography
								variant="caption"
								sx={{
									color: '#6b7280',
									fontWeight: 700,
									fontSize: '0.6875rem',
									letterSpacing: '0.5px',
									textTransform: 'uppercase',
									display: 'block'
								}}
							>
								SKU
							</Typography>
							<Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
								{serialReturn.item_serial?.item?.sku || 'N/A'}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant="caption"
								sx={{
									color: '#6b7280',
									fontWeight: 700,
									fontSize: '0.6875rem',
									letterSpacing: '0.5px',
									textTransform: 'uppercase',
									display: 'block'
								}}
							>
								Número de Serial
							</Typography>
							<Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
								{serialReturn.item_serial?.serial_number}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant="caption"
								sx={{
									color: '#6b7280',
									fontWeight: 700,
									fontSize: '0.6875rem',
									letterSpacing: '0.5px',
									textTransform: 'uppercase',
									display: 'block'
								}}
							>
								Documento / Nota de Crédito
							</Typography>
							<Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
								{serialReturn.document?.number_serie || `NC-ID: ${serialReturn.document_id}`}
							</Typography>
						</Box>
					</Box>

					{serialReturn.customer_notes && (
						<Box>
							<Typography
								variant="caption"
								sx={{
									color: '#6b7280',
									fontWeight: 700,
									fontSize: '0.6875rem',
									letterSpacing: '0.5px',
									textTransform: 'uppercase',
									display: 'block',
									mb: 0.5
								}}
							>
								Motivo Reportado por Cliente / Notas
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
								"{serialReturn.customer_notes}"
							</Typography>
						</Box>
					)}
				</Box>

				<Divider />

				{/* Processing Section */}
				{!serialReturn.is_processed ? (
					<>
						<Typography variant="caption" sx={{ color: '#374151', fontWeight: 700, mb: -1.5, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
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
									borderColor: decision === 'approve' ? '#2e7d32' : '#e5e7eb',
									bgcolor: decision === 'approve' ? 'rgba(46, 125, 50, 0.04)' : 'transparent',
									borderRadius: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 1,
									transition: 'all 0.2s ease-in-out',
									'&:hover': {
										borderColor: decision === 'approve' ? '#2e7d32' : '#9ca3af',
										bgcolor: decision === 'approve' ? 'rgba(46, 125, 50, 0.08)' : 'rgba(0,0,0,0.02)'
									}
								}}
							>
								<CheckCircle2 size={32} style={{ color: decision === 'approve' ? '#2e7d32' : '#9ca3af' }} />
								<Typography variant="body2" fontWeight={700} color={decision === 'approve' ? 'success.main' : 'text.primary'}>
									Aprobar Ingreso
								</Typography>
								<Typography variant="caption" color="text.secondary" align="center" sx={{ fontSize: '0.7rem' }}>
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
									borderColor: decision === 'reject' ? '#d32f2f' : '#e5e7eb',
									bgcolor: decision === 'reject' ? 'rgba(211, 47, 47, 0.04)' : 'transparent',
									borderRadius: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 1,
									transition: 'all 0.2s ease-in-out',
									'&:hover': {
										borderColor: decision === 'reject' ? '#d32f2f' : '#9ca3af',
										bgcolor: decision === 'reject' ? 'rgba(211, 47, 47, 0.08)' : 'rgba(0,0,0,0.02)'
									}
								}}
							>
								<XCircle size={32} style={{ color: decision === 'reject' ? '#d32f2f' : '#9ca3af' }} />
								<Typography variant="body2" fontWeight={700} color={decision === 'reject' ? 'error.main' : 'text.primary'}>
									Rechazar / Dañado
								</Typography>
								<Typography variant="caption" color="text.secondary" align="center" sx={{ fontSize: '0.7rem' }}>
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
								{reasons.flatMap((r) =>
									r.is_active ? [
										<MenuItem key={r.id} value={r.id}>
											{r.name}
										</MenuItem>
									] : []
								)}
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
									<XCircle size={20} />
									<Typography variant="subtitle2" fontWeight={700}>
										Rechazado (Registrado como Dañado)
									</Typography>
								</Box>
							) : (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
									<CheckCircle2 size={20} />
									<Typography variant="subtitle2" fontWeight={700}>
										Aprobado (Disponible para Venta)
									</Typography>
								</Box>
							)}
						</Box>

						<Box>
							<Typography
								variant="caption"
								sx={{
									color: '#6b7280',
									fontWeight: 700,
									fontSize: '0.6875rem',
									letterSpacing: '0.5px',
									textTransform: 'uppercase',
									display: 'block',
									mb: 0.5
								}}
							>
								Motivo de Devolución Confirmado
							</Typography>
							<Typography variant="body2" fontWeight={600}>
								{serialReturn.reason?.name || 'No especificado'}
							</Typography>
						</Box>

						<Box>
							<Typography
								variant="caption"
								sx={{
									color: '#6b7280',
									fontWeight: 700,
									fontSize: '0.6875rem',
									letterSpacing: '0.5px',
									textTransform: 'uppercase',
									display: 'block',
									mb: 0.5
								}}
							>
								Diagnóstico Técnico
							</Typography>
							<Typography variant="body2">
								{serialReturn.technical_notes || 'Sin diagnóstico técnico registrado.'}
							</Typography>
						</Box>

						<Divider />

						<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
							<Box>
								<Typography
									variant="caption"
									sx={{
										color: '#6b7280',
										fontWeight: 700,
										fontSize: '0.6875rem',
										letterSpacing: '0.5px',
										textTransform: 'uppercase',
										display: 'block',
										mb: 0.5
									}}
								>
									Inspeccionado Por
								</Typography>
								<Typography variant="body2" fontWeight={600}>
									{serialReturn.processed_by_user?.name || 'Sistema'}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{
										color: '#6b7280',
										fontWeight: 700,
										fontSize: '0.6875rem',
										letterSpacing: '0.5px',
										textTransform: 'uppercase',
										display: 'block',
										mb: 0.5
									}}
								>
									Fecha de Inspección
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
					bgcolor: '#f3f4f6',
					borderTop: '1px solid',
					borderColor: '#e5e7eb',
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
					sx={{
						borderRadius: 0,
						bgcolor: '#ffffff',
						color: '#374151',
						borderColor: '#d1d5db',
						px: 3,
						py: 0.75,
						textTransform: 'none',
						fontWeight: 600,
						fontSize: '0.8125rem',
						'&:hover': {
							bgcolor: '#f9fafb',
							borderColor: '#c5c9d1'
						}
					}}
				>
					{serialReturn.is_processed ? 'Cerrar' : 'Cancelar'}
				</Button>
				{!serialReturn.is_processed && (
					<Button
						variant="contained"
						size="small"
						onClick={handleSave}
						disabled={isProcessing || !reasonId}
						sx={{
							borderRadius: 0,
							bgcolor: '#000000',
							color: '#ffffff',
							px: 3,
							py: 0.75,
							textTransform: 'none',
							fontWeight: 600,
							fontSize: '0.8125rem',
							'&:hover': {
								bgcolor: '#1f2937'
							}
						}}
						startIcon={isProcessing ? <CircularProgress size={14} color="inherit" /> : <Save size={14} />}
					>
						Guardar Diagnóstico
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
