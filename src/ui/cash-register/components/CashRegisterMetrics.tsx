import { Box, Typography, Card, Divider, useTheme, alpha } from '@mui/material';
import { Landmark, Scale, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ICashRegisterSummary } from '@/types/cash-register.types';

interface CashRegisterMetricsProps {
	summary: ICashRegisterSummary;
	pendingApprovals: number;
}

/**
 * Tarjeta de Saldos (Inicial vs Actual)
 */
function CashRegisterSaldosCard({ saldoInicial, saldoActual }: { saldoInicial: number; saldoActual: number }) {
	const theme = useTheme();
	return (
		<Card sx={{ 
			p: 2.5, 
			borderRadius: '4px', 
			borderLeft: `4px solid #005483`,
			display: 'flex', 
			flexDirection: 'column', 
			gap: 1.5 
		}}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Landmark size={16} color={theme.palette.text.secondary} />
				<Typography variant="caption" fontWeight={700} color="text.secondary">SALDOS DE CAJA</Typography>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
				<Box>
					<Typography variant="caption" color="text.secondary" display="block">Inicial</Typography>
					<Typography variant="subtitle2" fontWeight={700}>
						{saldoInicial.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
					</Typography>
				</Box>
				<Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
				<Box>
					<Typography variant="caption" color="primary.main" display="block" fontWeight={700}>Actual</Typography>
					<Typography variant="h6" fontWeight={900} color="primary.main">
						{saldoActual.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
					</Typography>
				</Box>
			</Box>
		</Card>
	);
}

/**
 * Tarjeta de Balance Operativo
 */
function CashRegisterBalanceCard({ saldoInicial, balance }: { saldoInicial: number; balance: number }) {
	const theme = useTheme();
	const percentage = saldoInicial > 0 ? ((balance / saldoInicial) * 100).toFixed(1) : '0.0';
	return (
		<Card sx={{ 
			p: 2.5, 
			borderRadius: '4px', 
			borderLeft: `4px solid ${balance >= 0 ? theme.palette.success.main : theme.palette.error.main}`,
			display: 'flex', 
			flexDirection: 'column', 
			gap: 1.5 
		}}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Scale size={16} color={balance >= 0 ? theme.palette.success.main : theme.palette.error.main} />
				<Typography variant="caption" fontWeight={700} color="text.secondary">BALANCE OPERATIVO</Typography>
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
				<Typography variant="h5" fontWeight={900} color={balance >= 0 ? 'success.main' : 'error.main'}>
					{balance >= 0 ? '+' : ''}{balance.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
				</Typography>
				<Typography variant="caption" color={balance >= 0 ? 'success.main' : 'error.main'} fontWeight={700}>
					({balance >= 0 ? '↑' : '↓'} {percentage}%)
				</Typography>
			</Box>
		</Card>
	);
}

/**
 * Tarjeta de Aprobaciones Pendientes
 */
function CashRegisterAprobacionesCard({ count, isLocked }: { count: number; isLocked: boolean }) {
	const theme = useTheme();
	return (
		<Card sx={{ 
			p: 2.5, 
			borderRadius: '4px', 
			borderLeft: `4px solid ${isLocked ? theme.palette.warning.main : theme.palette.success.main}`,
			display: 'flex', 
			flexDirection: 'column', 
			gap: 1.5 
		}}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Clock size={16} color={isLocked ? theme.palette.warning.main : theme.palette.success.main} />
				<Typography variant="caption" fontWeight={700} color="text.secondary">ESTADO DE APROBACIONES</Typography>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="h5" fontWeight={900} color={isLocked ? 'warning.main' : 'success.main'}>
					{count}
				</Typography>
				<Typography variant="caption" color="text.secondary" fontWeight={600}>
					Pendientes de validar
				</Typography>
			</Box>
		</Card>
	);
}

/**
 * Banner de Estado de Cierre
 */
function CashRegisterClosureStatus({ isLocked }: { isLocked: boolean }) {
	const theme = useTheme();
	return (
		<Box sx={{ 
			p: 2, 
			borderRadius: '4px', 
			bgcolor: isLocked ? alpha(theme.palette.warning.main, 0.08) : alpha(theme.palette.success.main, 0.08),
			borderLeft: `4px solid ${isLocked ? theme.palette.warning.main : theme.palette.success.main}`,
			display: 'flex',
			gap: 1.5,
			alignItems: 'center',
			height: '100%'
		}}>
			{isLocked ? (
				<AlertCircle size={20} color={theme.palette.warning.main} />
			) : (
				<CheckCircle size={20} color={theme.palette.success.main} />
			)}
			<Box>
				<Typography variant="caption" fontWeight={800} color={isLocked ? 'warning.dark' : 'success.dark'} display="block">
					{isLocked ? 'CIERRE BLOQUEADO' : 'SISTEMA LISTO PARA CIERRE'}
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', lineHeight: 1.2 }}>
					{isLocked ? 'Revise aprobaciones' : 'Sin pendientes'}
				</Typography>
			</Box>
		</Box>
	);
}

/**
 * Componente Principal de Métricas de Caja
 */
export default function CashRegisterMetrics({ summary, pendingApprovals }: CashRegisterMetricsProps) {
	const saldoInicial = summary?.opening_balance ?? 0;
	const saldoActual = summary?.calculated_balance ?? 0;
	const balance = saldoActual - saldoInicial;
	const isLocked = pendingApprovals > 0;

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
			<CashRegisterSaldosCard 
				saldoInicial={saldoInicial} 
				saldoActual={saldoActual} 
			/>
			
			<CashRegisterBalanceCard 
				saldoInicial={saldoInicial} 
				balance={balance} 
			/>

			<CashRegisterAprobacionesCard 
				count={pendingApprovals} 
				isLocked={isLocked} 
			/>

			<CashRegisterClosureStatus 
				isLocked={isLocked} 
			/>
		</Box>
	);
}
