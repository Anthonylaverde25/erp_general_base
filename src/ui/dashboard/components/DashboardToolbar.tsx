import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type DashboardToolbarProps = {
	isEditing: boolean;
	onToggleEdit: () => void;
	onResetLayout: () => void;
};

/**
 * Dashboard toolbar with board tabs, edit structure toggle, and reset layout button.
 */
function DashboardToolbar({ isEditing, onToggleEdit, onResetLayout }: DashboardToolbarProps) {
	return (
		<>
			{/* Main toolbar */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
				<Box
					sx={{
						display: 'flex',
						bgcolor: 'text.primary',
						color: 'background.paper',
						borderRadius: 1,
						overflow: 'hidden'
					}}
				>
					<Button
						size="small"
						sx={{
							color: 'inherit',
							textTransform: 'none',
							fontWeight: 600,
							px: 2,
							minWidth: 'auto',
							borderRadius: 0
						}}
					>
						Resumen
					</Button>
					<Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.2)' }} />
					<IconButton
						size="small"
						sx={{ color: 'inherit', borderRadius: 0, p: '4px' }}
					>
						<MoreVertIcon fontSize="small" />
					</IconButton>
				</Box>

				<Button
					size="small"
					sx={{
						textTransform: 'none',
						color: 'text.primary',
						fontWeight: 600,
						bgcolor: 'background.paper',
						border: '1px solid',
						borderColor: 'divider',
						'&:hover': { bgcolor: 'action.hover' }
					}}
				>
					Equipo
				</Button>
				<Button
					size="small"
					sx={{
						textTransform: 'none',
						color: 'text.primary',
						fontWeight: 600,
						bgcolor: 'background.paper',
						border: '1px solid',
						borderColor: 'divider',
						'&:hover': { bgcolor: 'action.hover' }
					}}
				>
					Proyectos
				</Button>
				<Button
					size="small"
					startIcon={<AddIcon />}
					sx={{ ml: 1, textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
				>
					Nuevo board
				</Button>

				<Box sx={{ flexGrow: 1 }} />

				{isEditing && (
					<Button
						size="small"
						onClick={onResetLayout}
						sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
					>
						Restablecer Diseño
					</Button>
				)}

				<Button
					size="small"
					onClick={onToggleEdit}
					variant={isEditing ? 'contained' : 'outlined'}
					color={isEditing ? 'primary' : 'inherit'}
					sx={{ textTransform: 'none', fontWeight: 600 }}
				>
					{isEditing ? '✓ Guardar Estructura' : '⊞ Editar Estructura'}
				</Button>

				<Button
					size="small"
					startIcon={<AddIcon />}
					sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 600 }}
				>
					Añadir
				</Button>
			</Box>

			{/* Edit mode hint banner */}
			{isEditing && (
				<Box
					sx={{
						mb: 2,
						px: 2,
						py: 1,
						borderRadius: 1,
						bgcolor: 'primary.main',
						color: 'primary.contrastText',
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						fontSize: 13
					}}
				>
					<DragIndicatorIcon fontSize="small" />
					<Typography
						variant="caption"
						sx={{ fontWeight: 600 }}
					>
						Modo edición activo — Arrastra las tarjetas desde el ícono ⠿ · Redimensiona desde la esquina
						inferior derecha
					</Typography>
				</Box>
			)}
		</>
	);
}

export default DashboardToolbar;
