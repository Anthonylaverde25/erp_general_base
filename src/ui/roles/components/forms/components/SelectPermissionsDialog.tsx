import React, { useState, useEffect } from 'react';
import { 
	Dialog, 
	Box, 
	Typography, 
	IconButton, 
	Divider, 
	Button, 
	Stack,
	CircularProgress,
	DialogContent
} from '@mui/material';
import { Close, Security, CheckCircle } from '@mui/icons-material';

import RoleSummaryHeader from './RoleSummaryHeader';
import PermissionsTable from './PermissionsTable';

interface SelectPermissionsDialogProps {
	open: boolean;
	onClose: () => void;
	selectedPermissions: number[];
	onSave: (permissions: number[]) => void;
	roleDetails: {
		name: string;
		code: string;
		active: boolean;
		description: string;
	};
	modulesCatalog: any[];
	isLoadingCatalog: boolean;
}

export default function SelectPermissionsDialog({
	open,
	onClose,
	selectedPermissions,
	onSave,
	roleDetails,
	modulesCatalog,
	isLoadingCatalog
}: SelectPermissionsDialogProps) {
	const [tempPermissions, setTempPermissions] = useState<number[]>([]);

	// Al abrir el diálogo, clonar la selección actual
	useEffect(() => {
		if (open) {
			setTempPermissions([...selectedPermissions]);
		}
	}, [open, selectedPermissions]);

	const handleTogglePermission = (id: number) => {
		if (tempPermissions.includes(id)) {
			setTempPermissions(tempPermissions.filter((pId) => pId !== id));
		} else {
			setTempPermissions([...tempPermissions, id]);
		}
	};

	const handleSelectAllModule = (modulePermissions: any[], isAllSelected: boolean) => {
		const modulePermissionIds = modulePermissions.map((p) => p.id);
		if (isAllSelected) {
			setTempPermissions(tempPermissions.filter((pId) => !modulePermissionIds.includes(pId)));
		} else {
			const uniqueIds = Array.from(new Set([...tempPermissions, ...modulePermissionIds]));
			setTempPermissions(uniqueIds);
		}
	};

	const handleApply = () => {
		onSave(tempPermissions);
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 0,
					bgcolor: 'background.paper',
					boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
					width: '100%'
				}
			}}
		>
			{/* Dialog Header */}
			<Box
				sx={{
					p: 3,
					pb: 2,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<Box>
					<Typography
						variant="subtitle1"
						fontWeight={750}
						sx={{ fontSize: '1.15rem', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}
					>
						<Security color="primary" /> Configurar Permisos
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 0.5, fontSize: '0.875rem' }}
					>
						Asigne los accesos operativos del sistema para este rol
					</Typography>
				</Box>
				<IconButton 
					onClick={onClose} 
					size="small" 
					sx={{ color: '#4b5563', borderRadius: 0 }}
				>
					<Close sx={{ fontSize: 20 }} />
				</IconButton>
			</Box>

			<Divider />

			{/* Dialog Body with scroll */}
			<DialogContent
				sx={{
					p: 3,
					display: 'flex',
					flexDirection: 'column',
					maxHeight: '65vh',
					overflowY: 'auto'
				}}
			>
				<RoleSummaryHeader
					name={roleDetails.name}
					code={roleDetails.code}
					active={roleDetails.active}
					description={roleDetails.description}
				/>

				<Stack
					direction="row"
					spacing={1}
					alignItems="center"
					sx={{ mb: 2 }}
				>
					<Security
						fontSize="small"
						color="primary"
					/>
					<Typography
						variant="subtitle1"
						fontWeight={600}
						color="text.primary"
					>
						{`Matriz de Permisos (${tempPermissions.length} seleccionados)`}
					</Typography>
				</Stack>

				{isLoadingCatalog ? (
					<Stack
						alignItems="center"
						justifyContent="center"
						sx={{ py: 6 }}
						spacing={2}
					>
						<CircularProgress size={40} />
						<Typography variant="body2" color="text.secondary">
							Cargando catálogo de permisos...
						</Typography>
					</Stack>
				) : (
					<PermissionsTable
						modulesCatalog={modulesCatalog || []}
						selectedPermissions={tempPermissions}
						onTogglePermission={handleTogglePermission}
						onSelectAllModule={handleSelectAllModule}
					/>
				)}
			</DialogContent>

			<Divider />

			{/* Dialog Footer */}
			<Box
				sx={{
					p: 3,
					bgcolor: '#f3f4f6',
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					gap: 2
				}}
			>
				<Button
					key="cancel-perms-btn"
					type="button"
					onClick={onClose}
					sx={{
						borderRadius: 0,
						bgcolor: '#ffffff',
						color: '#374151',
						borderColor: '#d1d5db',
						px: 3,
						py: 0.75,
						textTransform: 'none',
						fontWeight: 600,
						fontSize: '0.8125rem',
						border: '1px solid',
						'&:hover': {
							bgcolor: '#f9fafb',
							borderColor: '#c5c9d1'
						}
					}}
				>
					Cancelar
				</Button>

				<Button
					key="apply-perms-btn"
					type="button"
					variant="contained"
					color="primary"
					onClick={handleApply}
					startIcon={<CheckCircle fontSize="small" />}
					sx={{
						borderRadius: 0,
						px: 4,
						py: 0.75,
						textTransform: 'none',
						fontWeight: 600,
						fontSize: '0.8125rem'
					}}
				>
					Aplicar Selección
				</Button>
			</Box>
		</Dialog>
	);
}
