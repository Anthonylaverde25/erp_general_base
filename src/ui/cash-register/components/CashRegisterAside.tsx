import { Box, Typography, Divider, useTheme, alpha, Button } from '@mui/material';
import { Landmark, TrendingUp, Scale, Clock, CheckCircle, AlertCircle, PlusCircle, MinusCircle } from 'lucide-react';

interface CashRegisterAsideProps {
	pendingCount?: number;
}

export default function CashRegisterAside({ pendingCount = 0 }: CashRegisterAsideProps) {
	const theme = useTheme();

	// Datos simulados
	const saldoInicial = 5000.00;
	const saldoActual = 6850.50;
	const balance = saldoActual - saldoInicial;
	const porcentajeBalance = ((balance / saldoInicial) * 100).toFixed(1);

	const isLocked = pendingCount > 0;

	return (
		<Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4, height: '100%', bgcolor: 'background.paper' }}>
			
			{/* Fila de Saldos Principales */}
			<Box sx={{ display: 'flex', gap: 3 }}>
				{/* Saldo Inicial */}
				<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Landmark size={14} color={theme.palette.text.secondary} />
						<Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
							INICIAL
						</Typography>
					</Box>
					<Typography variant="subtitle1" fontWeight={600} noWrap color="text.primary">
						{saldoInicial.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
					</Typography>
				</Box>

				<Divider orientation="vertical" flexItem sx={{ opacity: 0.3 }} />

				{/* Saldo Actual */}
				<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<TrendingUp size={14} color={theme.palette.primary.main} />
						<Typography variant="caption" color="primary.main" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
							ACTUAL
						</Typography>
					</Box>
					<Typography variant="subtitle1" fontWeight={900} color="primary.main" noWrap>
						{saldoActual.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
					</Typography>
				</Box>
			</Box>

			<Divider sx={{ opacity: 0.3 }} />

			{/* Balance Operativo y Acciones Rápidas */}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Scale size={14} color={balance >= 0 ? theme.palette.success.main : theme.palette.error.main} />
						<Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 0.5 }}>
							BALANCE DE TURNO
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
						<Typography variant="h5" fontWeight={500} color={balance >= 0 ? 'success.main' : 'error.main'}>
							{balance >= 0 ? '+' : ''}{balance.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
						</Typography>
						<Typography variant="caption" color={balance >= 0 ? 'success.main' : 'error.main'} fontWeight={700}>
							({balance >= 0 ? '↑' : '↓'} {porcentajeBalance}%)
						</Typography>
					</Box>
				</Box>

				{/* Acciones de Liquidez (Reposicionadas y Modestas) */}
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					<Button 
						variant="text" 
						size="small"
						color="success"
						startIcon={<PlusCircle size={14} />}
						fullWidth
						sx={{ 
							borderRadius: '2px', 
							textTransform: 'none', 
							fontWeight: 600, 
							justifyContent: 'flex-start',
							py: 0.5,
							px: 1,
							'&:hover': { bgcolor: alpha(theme.palette.success.main, 0.05) }
						}}
					>
						Ingresar Fondo
					</Button>
					<Button 
						variant="text" 
						size="small"
						color="error"
						startIcon={<MinusCircle size={14} />}
						fullWidth
						sx={{ 
							borderRadius: '2px', 
							textTransform: 'none', 
							fontWeight: 600, 
							justifyContent: 'flex-start',
							py: 0.5,
							px: 1,
							'&:hover': { bgcolor: alpha(theme.palette.error.main, 0.05) }
						}}
					>
						Retiro de Seguridad
					</Button>
				</Box>
			</Box>

			<Divider sx={{ opacity: 0.3 }} />

			{/* Sección de Aprobaciones */}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Clock size={14} color={isLocked ? theme.palette.warning.main : theme.palette.text.secondary} />
					<Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 0.5 }}>
						ESTADO DE APROBACIONES
					</Typography>
				</Box>
				
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant="body2" fontWeight={600} color="text.primary">
						Pendientes de aprobar
					</Typography>
					<Typography 
						variant="h6" 
						fontWeight={900} 
						color={isLocked ? 'warning.main' : 'success.main'}
					>
						{pendingCount}
					</Typography>
				</Box>

				{/* Banner de Estado de Cierre */}
				<Box sx={{ 
					p: 2, 
					borderRadius: '4px', 
					bgcolor: isLocked ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.success.main, 0.1),
					borderLeft: `4px solid ${isLocked ? theme.palette.warning.main : theme.palette.success.main}`,
					display: 'flex',
					gap: 1.5,
					alignItems: 'start'
				}}>
					{isLocked ? (
						<AlertCircle size={18} color={theme.palette.warning.main} style={{ marginTop: 2 }} />
					) : (
						<CheckCircle size={18} color={theme.palette.success.main} style={{ marginTop: 2 }} />
					)}
					<Box>
						<Typography variant="caption" fontWeight={700} color={isLocked ? 'warning.dark' : 'success.dark'} display="block">
							{isLocked ? 'CIERRE BLOQUEADO' : 'CERRAR CAJA HABILITADO'}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', lineHeight: 1.2 }}>
							{isLocked 
								? 'Debe aprobar todas las operaciones para poder finalizar el turno.' 
								: 'Todas las operaciones han sido validadas correctamente.'}
						</Typography>
					</Box>
				</Box>
			</Box>

			<Box sx={{ 
				mt: 'auto', 
				p: 2, 
				borderLeft: '2px solid', 
				borderColor: 'primary.main', 
				bgcolor: 'action.hover', 
				borderRadius: '0 4px 4px 0' 
			}}>
				<Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', lineHeight: 1.3, display: 'block' }}>
					Los valores mostrados son informativos y están sujetos a validación durante el arqueo de cierre.
				</Typography>
			</Box>
		</Box>
	);
}
