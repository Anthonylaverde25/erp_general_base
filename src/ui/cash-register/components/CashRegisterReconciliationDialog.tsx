import { useState, useMemo } from 'react';
import { 
	Dialog, 
	DialogTitle, 
	DialogContent, 
	DialogActions, 
	Button, 
	Typography, 
	Box, 
	TextField,
	Divider,
	useTheme,
	alpha
} from '@mui/material';
import { ShieldAlert, Calculator, DollarSign, CreditCard } from 'lucide-react';

interface CashRegisterReconciliationDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (declaradoEfectivo: number, declaradoTarjetas: number, justificacion: string) => void;
	// En un escenario real, esto viene del sistema backend al iniciar el arqueo.
	// Por ahora simulamos los totales esperados.
	expectedEfectivo?: number;
	expectedTarjetas?: number;
}

export default function CashRegisterReconciliationDialog({
	open,
	onClose,
	onConfirm,
	expectedEfectivo = 4500.00,
	expectedTarjetas = 2350.50
}: CashRegisterReconciliationDialogProps) {
	const theme = useTheme();

	// Estados de declaración del cajero (Cierre Ciego Inicial)
	const [declaradoEfectivoStr, setDeclaradoEfectivoStr] = useState('');
	const [declaradoTarjetasStr, setDeclaradoTarjetasStr] = useState('');
	
	// Estado para mostrar las diferencias o forzar Cierre Ciego
	const [showDifferences, setShowDifferences] = useState(false);
	const [justificacion, setJustificacion] = useState('');

	// Cálculos de diferencias
	const declaradoEfectivo = parseFloat(declaradoEfectivoStr) || 0;
	const declaradoTarjetas = parseFloat(declaradoTarjetasStr) || 0;
	const diffEfectivo = declaradoEfectivo - expectedEfectivo;
	const diffTarjetas = declaradoTarjetas - expectedTarjetas;
	const isDescuadre = diffEfectivo !== 0 || diffTarjetas !== 0;

	// Resetear estado al abrir
	useMemo(() => {
		if (open) {
			setDeclaradoEfectivoStr('');
			setDeclaradoTarjetasStr('');
			setShowDifferences(false);
			setJustificacion('');
		}
	}, [open]);

	const handleVerify = () => {
		if (declaradoEfectivoStr.trim() !== '' && declaradoTarjetasStr.trim() !== '') {
			setShowDifferences(true);
		}
	};

	const handleConfirm = () => {
		onConfirm(declaradoEfectivo, declaradoTarjetas, justificacion);
	};

	return (
		<Dialog 
			open={open} 
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: { borderRadius: '4px', bgcolor: 'background.paper' }
			}}
		>
			<DialogTitle sx={{ 
				display: 'flex', alignItems: 'center', gap: 1.5, 
				bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : 'primary.main',
				color: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.contrastText',
				pb: 2
			}}>
				<ShieldAlert size={24} />
				<Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
					Arqueo de Caja (Reporte Z)
				</Typography>
			</DialogTitle>
			
			<DialogContent sx={{ p: 4 }}>
				<Box sx={{ mb: 4, mt: 1 }}>
					<Typography variant="body2" color="text.secondary">
						Para proceder con el cierre de turno, por favor declare el efectivo físico en gaveta y los lotes consolidados de tarjetas (Cierre Ciego).
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					{/* Declaración de Efectivo */}
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
						<Box sx={{ mt: 1, p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
							<DollarSign size={24} color={theme.palette.success.main} />
						</Box>
						<Box sx={{ flex: 1 }}>
							<TextField 
								fullWidth
								variant="filled"
								label="Total Efectivo Declarado"
								type="number"
								value={declaradoEfectivoStr}
								onChange={(e) => setDeclaradoEfectivoStr(e.target.value)}
								disabled={showDifferences}
								InputProps={{
									startAdornment: <Typography variant="h6" sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
								}}
							/>
						</Box>
					</Box>

					{/* Declaración de Tarjetas */}
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
						<Box sx={{ mt: 1, p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
							<CreditCard size={24} color={theme.palette.info.main} />
						</Box>
						<Box sx={{ flex: 1 }}>
							<TextField 
								fullWidth
								variant="filled"
								label="Total Lotes de Tarjeta Declarados"
								type="number"
								value={declaradoTarjetasStr}
								onChange={(e) => setDeclaradoTarjetasStr(e.target.value)}
								disabled={showDifferences}
								InputProps={{
									startAdornment: <Typography variant="h6" sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
								}}
							/>
						</Box>
					</Box>
				</Box>

				{/* Vista de Diferencias (Solo se muestra tras Verificar) */}
				{showDifferences && (
					<Box sx={{ mt: 4 }}>
						<Typography variant="subtitle2" fontWeight={800} color="text.secondary" gutterBottom>
							RESULTADO DE CONCILIACIÓN
						</Typography>

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, bgcolor: 'action.hover', borderRadius: 1, borderLeft: '4px solid', borderColor: isDescuadre ? 'error.main' : 'success.main' }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography variant="body2" color="text.secondary">Diferencia en Efectivo:</Typography>
								<Typography variant="subtitle1" fontWeight={800} color={diffEfectivo === 0 ? 'success.main' : (diffEfectivo > 0 ? 'info.main' : 'error.main')}>
									{diffEfectivo > 0 ? '+' : ''}{diffEfectivo.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography variant="body2" color="text.secondary">Diferencia en Tarjetas:</Typography>
								<Typography variant="subtitle1" fontWeight={800} color={diffTarjetas === 0 ? 'success.main' : (diffTarjetas > 0 ? 'info.main' : 'error.main')}>
									{diffTarjetas > 0 ? '+' : ''}{diffTarjetas.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
								</Typography>
							</Box>

							{isDescuadre ? (
								<Box sx={{ mt: 2 }}>
									<Typography variant="caption" color="error.main" fontWeight={600} display="block" gutterBottom>
										Se han detectado descuadres (Sobrante/Faltante).
										Debe ingresar una glosa justificativa obligatoria para poder concluir el cierre.
									</Typography>
									<TextField
										label="Glosa / Justificación de Caja"
										variant="filled"
										multiline
										rows={2}
										fullWidth
										required
										value={justificacion}
										onChange={(e) => setJustificacion(e.target.value)}
									/>
								</Box>
							) : (
								<Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
									<CheckCircle size={18} color={theme.palette.success.main} />
									<Typography variant="caption" color="success.main" fontWeight={700}>
										Conciliación perfecta. Cuadre verificado.
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
				)}
			</DialogContent>
			
			<Divider />
			
			<DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
				<Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>
					Cancelar
				</Button>
				
				{!showDifferences ? (
					<Button 
						variant="contained" 
						color="primary"
						startIcon={<Calculator size={18} />}
						onClick={handleVerify}
						disabled={!declaradoEfectivoStr || !declaradoTarjetasStr}
						sx={{ borderRadius: '4px', textTransform: 'none', fontWeight: 600 }}
					>
						Verificar Cuadre
					</Button>
				) : (
					<Button 
						variant="contained" 
						onClick={handleConfirm}
						disabled={isDescuadre && justificacion.trim() === ''}
						sx={{ 
							bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : '#005483',
							color: 'white',
							borderRadius: '4px', 
							textTransform: 'none', 
							fontWeight: 600,
							'&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : '#003e61' }
						}}
					>
						Confirmar Cierre Z
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}

// Ensure icons used exist (lucide-react imports Fix for CheckCircle not in original imports above)
import { CheckCircle } from 'lucide-react';
