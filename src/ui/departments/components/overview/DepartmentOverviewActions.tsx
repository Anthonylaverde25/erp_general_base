import { Button, SxProps, Theme } from '@mui/material';
import { AdminPanelSettings, FolderOpenOutlined, History, PersonAddOutlined } from '@mui/icons-material';

interface DepartmentOverviewActionsProps {
	onAddCollaborator: () => void;
	onViewAllDocuments: () => void;
}

const actionBtnSx: SxProps<Theme> = {
	textTransform: 'none',
	fontWeight: 600,
	fontSize: '0.75rem',
	color: 'text.secondary',
	py: 0.5,
	px: 1.5,
	borderRadius: 0.5,
	border: '1px solid',
	borderColor: 'divider',
	bgcolor: 'transparent',
	'&:hover': {
		bgcolor: 'action.hover',
		color: 'text.primary',
		borderColor: 'divider'
	}
};

export default function DepartmentOverviewActions({
	onAddCollaborator,
	onViewAllDocuments
}: DepartmentOverviewActionsProps) {
	return (
		<div className="mt-2 mb-4 flex flex-wrap items-center gap-2">
			<Button
				variant="outlined"
				color="primary"
				size="small"
				className="flex items-center gap-2"
				onClick={onAddCollaborator}
				sx={{
					...actionBtnSx,
					borderColor: 'primary.main',
					bgcolor: 'primary.main',
					color: 'primary.contrastText',
					border: 'none',
					'&:hover': {
						bgcolor: 'primary.dark',
						color: 'primary.contrastText'
					}
				}}
			>
				<PersonAddOutlined fontSize="small" />
				Agregar colaborador o empleado
			</Button>
			<Button
				variant="outlined"
				color="primary"
				size="small"
				className="flex items-center gap-2"
				onClick={onViewAllDocuments}
				sx={actionBtnSx}
			>
				<FolderOpenOutlined fontSize="small" />
				Ver todos los documentos
			</Button>
			<Button
				variant="outlined"
				color="inherit"
				size="small"
				sx={actionBtnSx}
				className="flex items-center gap-2"
			>
				<AdminPanelSettings fontSize="small" />
				Permisos
			</Button>
			<Button
				variant="outlined"
				color="inherit"
				size="small"
				sx={actionBtnSx}
				className="flex items-center gap-2"
			>
				<History fontSize="small" />
				Historial
			</Button>
		</div>
	);
}
