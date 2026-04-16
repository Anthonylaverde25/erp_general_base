import { useState, MouseEvent } from 'react';
import { Box, Typography, Button, Tooltip, Stack, Menu, MenuItem, IconButton, alpha, useTheme } from '@mui/material';
import { Download, XCircle, Lock, MoreVertical } from 'lucide-react';
import PageBreadcrumb from '@/components/PageBreadcrumb';

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

	return (
		<Box
			className="container"
			sx={{ p: 0, pb: 2 }}
		>
			<PageBreadcrumb className="mb-4" />

			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
			>
				<Box>
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<Typography
							variant="h2"
							className="text-3xl font-bold tracking-tight"
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
					<Typography
						variant="subtitle1"
						color="text.secondary"
						sx={{ mt: 0.5 }}
					>
						Gestión de movimientos, control de flujo y arqueo de jornada
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Tooltip title={isLocked ? "Existen operaciones pendientes de aprobación" : ""}>
						<span>
							<Button
								variant="contained"
								size="small"
								startIcon={isLocked ? <Lock size={18} /> : <XCircle size={18} />}
								onClick={onClose}
								disabled={!isOpen || isLocked}
								sx={{
									bgcolor: isLocked ? 'text.disabled' : '#005483',
									borderRadius: '4px',
									textTransform: 'none',
									fontWeight: 600,
									minWidth: '140px',
									height: '36px',
									'&:hover': { bgcolor: isLocked ? 'text.disabled' : '#003e61' }
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
			</Stack>
		</Box>
	);
}
