import { useState, MouseEvent } from 'react';
import { Box, Typography, Button, Tooltip, Stack, Menu, MenuItem, IconButton, alpha, useTheme } from '@mui/material';
import { Lock, XCircle, MoreVertical } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

interface CashRegisterHeaderProps {
	isOpen: boolean;
	onClose: () => void;
	isLocked?: boolean;
}

export default function CashRegisterHeader({ isOpen, onClose, isLocked = false }: CashRegisterHeaderProps) {
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const openMenu = Boolean(anchorEl);

	const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const titleNode = (
		<Stack direction="row" alignItems="center" spacing={1.5}>
			<Typography
				variant="h5"
				sx={{ fontWeight: 900, color: 'text.primary' }}
			>
				Caja Registradora
			</Typography>
			<Box sx={{
				px: 1.5,
				py: 0.5,
				borderRadius: '4px',
				bgcolor: alpha(isOpen ? theme.palette.success.main : theme.palette.error.main, 0.1),
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				border: `1px solid ${alpha(isOpen ? theme.palette.success.main : theme.palette.error.main, 0.2)}`
			}}>
				<Box sx={{
					width: 8,
					height: 8,
					borderRadius: '50%',
					bgcolor: isOpen ? 'success.main' : 'error.main'
				}} />
				<Typography variant="caption" color={isOpen ? 'success.dark' : 'error.dark'} fontWeight={700}>
					TERMINAL #01 - {isOpen ? 'ABIERTA' : 'CERRADA'}
				</Typography>
			</Box>
		</Stack>
	);

	const actionsNode = (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
			<Tooltip title={isLocked ? "Existen operaciones pendientes de aprobación" : ""}>
				<span>
					<Button
						variant="contained"
						color="secondary"
						size="small"
						startIcon={isLocked ? <Lock size={18} /> : <XCircle size={18} />}
						onClick={onClose}
						disabled={!isOpen || isLocked}
						sx={{
							borderRadius: '4px',
							textTransform: 'none',
							fontWeight: 800,
							minWidth: '140px',
							height: '36px'
						}}
					>
						{isLocked ? 'Cierre Bloqueado' : 'Cerrar Caja'}
					</Button>
				</span>
			</Tooltip>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
				<IconButton
					size="small"
					onClick={handleOpenMenu}
					sx={{
						borderRadius: '4px',
						border: `1px solid ${theme.palette.divider}`,
						height: '36px',
						width: '36px'
					}}
				>
					<MoreVertical size={20} />
				</IconButton>
				<Menu
					anchorEl={anchorEl}
					open={openMenu}
					onClose={handleCloseMenu}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				>
					<MenuItem onClick={handleCloseMenu}>Ver historial de cierres</MenuItem>
					<MenuItem onClick={handleCloseMenu}>Configurar terminal</MenuItem>
					<MenuItem onClick={handleCloseMenu}>Sincronizar datos</MenuItem>
				</Menu>
			</Box>
		</Box>
	);

	return (
		<PageHeader
			title={titleNode}
			subtitle="Gestión de movimientos, control de flujo y arqueo de jornada"
			actions={actionsNode}
		/>
	);
}
