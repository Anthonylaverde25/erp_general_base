import { Box, Button, Typography, useTheme, alpha, IconButton } from '@mui/material';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CashRegisterAnalyticsHeaderProps {
	view: 'all' | 'ingresos' | 'egresos';
	onViewChange: (view: 'all' | 'ingresos' | 'egresos') => void;
	showChart: boolean;
	onToggleChart: () => void;
}

/**
 * Cabecera y Controles del Módulo de Analítica
 * Gestiona la identidad visual del gráfico y los filtros tácticos.
 */
export default function CashRegisterAnalyticsHeader({ view, onViewChange, showChart, onToggleChart }: CashRegisterAnalyticsHeaderProps) {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: showChart ? 4 : 0 }}>
			<Box className='flex justify-between w-full'>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<IconButton 
						size="small" 
						onClick={onToggleChart}
						sx={{ 
							bgcolor: alpha(theme.palette.primary.main, 0.05),
							border: `1px solid ${theme.palette.divider}`,
							borderRadius: '4px'
						}}
					>
						{showChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
					</IconButton>
					<Box>
						<Typography variant="subtitle1" fontWeight={900} sx={{ letterSpacing: '-0.02em', color: '#005483' }}>
							Análisis de Flujo & Liquidez
						</Typography>
						{showChart && (
							<Typography variant="caption" color="text.secondary" fontWeight={600}>
								Tendencia de ingresos, egresos y saldo neto acumulado
							</Typography>
						)}
					</Box>
				</Box>

				<Box className='flex items-center gap-2'>
					<Box sx={{ 
						display: 'flex', 
						bgcolor: alpha(theme.palette.action.hover, 0.5), 
						p: 0.5, 
						borderRadius: '4px', 
						gap: 0.5, 
						border: `1px solid ${theme.palette.divider}` 
					}}>
						<Button
							size="small"
							variant={view === 'all' ? 'contained' : 'text'}
							onClick={() => onViewChange('all')}
							sx={{ 
								textTransform: 'none', 
								px: 2, 
								borderRadius: '2px', 
								fontWeight: 800, 
								fontSize: '11px', 
								boxShadow: view === 'all' ? theme.shadows[1] : 'none' 
							}}
						>
							Vista Total
						</Button>
						<Button
							size="small"
							variant={view === 'ingresos' ? 'contained' : 'text'}
							onClick={() => onViewChange('ingresos')}
							color="primary"
							sx={{ 
								textTransform: 'none', 
								px: 2, 
								borderRadius: '2px', 
								fontWeight: 800, 
								fontSize: '11px', 
								boxShadow: view === 'ingresos' ? theme.shadows[1] : 'none' 
							}}
						>
							Entradas
						</Button>
						<Button
							size="small"
							variant={view === 'egresos' ? 'contained' : 'text'}
							onClick={() => onViewChange('egresos')}
							color="error"
							sx={{ 
								textTransform: 'none', 
								px: 2, 
								borderRadius: '2px', 
								fontWeight: 800, 
								fontSize: '11px', 
								boxShadow: view === 'egresos' ? theme.shadows[1] : 'none' 
							}}
						>
							Salidas
						</Button>
					</Box>

					<Button 
						className='border border-gray-300' 
						variant="text" 
						size="small" 
						sx={{ minWidth: '36px', height: '36px' }}
					>
						<SettingsTwoToneIcon fontSize="small" color="action" />
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
