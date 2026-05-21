import { Box, Typography, Stack, Button, Divider, alpha, useTheme } from '@mui/material';
import { PlusCircle, MinusCircle, Download } from 'lucide-react';

interface CashRegisterActionBarProps {
	isOpen: boolean;
	onDeposit: () => void;
	onWithdrawal: () => void;
}

/**
 * Barra de Acciones Operativas de la Caja
 * Centraliza los movimientos de liquidez y exportación.
 */
export default function CashRegisterActionBar({ isOpen, onDeposit, onWithdrawal }: CashRegisterActionBarProps) {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 2,
			p: 2,
			bgcolor: alpha(theme.palette.primary.main, 0.03),
			borderRadius: '4px',
			border: `1px solid ${theme.palette.divider}`
		}}>
			<Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mr: 2, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
				Operativa de Caja
			</Typography>

			<Stack direction="row" spacing={1.5}>
				<Button
					variant="outlined"
					size="small"
					color="success"
					startIcon={<PlusCircle size={16} />}
					disabled={!isOpen}
					onClick={onDeposit}
					sx={{ borderRadius: '4px', textTransform: 'none', fontWeight: 700, bgcolor: 'background.paper' }}
				>
					Ingresar Fondo
				</Button>
				<Button
					variant="outlined"
					size="small"
					color="error"
					startIcon={<MinusCircle size={16} />}
					disabled={!isOpen}
					onClick={onWithdrawal}
					sx={{ borderRadius: '4px', textTransform: 'none', fontWeight: 700, bgcolor: 'background.paper' }}
				>
					Retirar Efectivo
				</Button>
				<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
				<Button
					variant="text"
					size="small"
					color="inherit"
					startIcon={<Download size={16} />}
					sx={{ borderRadius: '4px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
				>
					Exportar Transacciones
				</Button>
			</Stack>
		</Box>
	);
}
