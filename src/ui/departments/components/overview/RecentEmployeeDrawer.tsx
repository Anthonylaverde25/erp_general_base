import { Box, Chip, CircularProgress, Divider, Drawer, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import useShowUser from '@/features/users/hooks/useShowUser';

interface RecentEmployeeDrawerProps {
	open: boolean;
	onClose: () => void;
	userId: number | null;
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
			>
				{label}
			</Typography>
			<Typography
				variant="body2"
				color="text.primary"
			>
				{value}
			</Typography>
		</Box>
	);
}

export default function RecentEmployeeDrawer({ open, onClose, userId }: RecentEmployeeDrawerProps) {
	const { user, isLoading, isError } = useShowUser(userId || 0);

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
		>
			<Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography
					variant="h6"
					fontWeight={700}
				>
					Perfil de usuario
				</Typography>
				<IconButton
					size="small"
					onClick={onClose}
				>
					<Close fontSize="small" />
				</IconButton>
			</Box>
			<Divider />

			<Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
				{isLoading ? (
					<Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
						<CircularProgress size={26} />
					</Box>
				) : isError || !user ? (
					<Typography color="error">No se pudo cargar la información del usuario.</Typography>
				) : (
					<>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<Typography
								variant="h5"
								fontWeight={700}
								sx={{ lineHeight: 1.2 }}
							>
								{user.full_name || `${user.name || ''} ${user.last_name || ''}`.trim() || 'Sin nombre'}
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
								<Chip
									label={user.is_active ? 'Activo' : 'Inactivo'}
									size="small"
									color={user.is_active ? 'success' : 'default'}
									variant={user.is_active ? 'filled' : 'outlined'}
								/>
								{user.role?.name && (
									<Chip
										label={user.role.name}
										size="small"
										variant="outlined"
									/>
								)}
							</Box>
						</Box>

						<Divider />

						<InfoRow
							label="Correo"
							value={user.email || 'No disponible'}
						/>
						<InfoRow
							label="Teléfono"
							value={user.phone || 'No disponible'}
						/>
						<InfoRow
							label="Dirección"
							value={user.address || 'No disponible'}
						/>
						<InfoRow
							label="Observaciones"
							value={user.observations || 'Sin observaciones'}
						/>
					</>
				)}
			</Box>
		</Drawer>
	);
}
