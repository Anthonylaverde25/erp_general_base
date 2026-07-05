import React from 'react';
import { Box, Stack, Typography, alpha, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PermissionRow from './PermissionRow';
import { getModuleIconName } from './ModuleTabs';
import { UserEntity } from '@/domain/entities/users/User';

interface ModuleSectionProps {
	module: any;
	user: UserEntity;
	localExceptions: Record<number, boolean | null>;
	onExceptionChange: (permissionId: number, value: string | null) => void;
}

export default function ModuleSection({ 
	module, 
	user, 
	localExceptions, 
	onExceptionChange 
}: ModuleSectionProps) {
	const theme = useTheme();
	const modulePerms = module.permissions || [];
	if (modulePerms.length === 0) return null;

	const iconName = getModuleIconName(module.code);

	return (
		<Box sx={{ pb: 1.5 }}>
			{/* Cabecera del Módulo */}
			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
				<Box sx={{
					p: 0.4,
					display: 'flex',
					bgcolor: alpha(theme.palette.primary.main, 0.08),
					color: 'primary.main',
					borderRadius: '3px'
				}}>
					<FuseSvgIcon size={14} color="primary">{iconName}</FuseSvgIcon>
				</Box>
				<Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.85rem' }}>
					{module.name}
				</Typography>
			</Stack>

			{/* Permisos */}
			<Stack spacing={1}>
				{modulePerms.map((permission: any) => {
					// 1. Verificar si el Rol Base del usuario tiene el permiso de forma nativa
					const isGrantedByRole = Array.isArray(user.role?.permissions) 
						? user.role.permissions.includes(permission.id)
						: false;

					// 2. Obtener el estado local de la excepción
					const localState = localExceptions[permission.id]; // true, false, o null (heredar)

					return (
						<PermissionRow
							key={permission.id}
							permission={permission}
							isGrantedByRole={isGrantedByRole}
							localState={localState}
							onExceptionChange={onExceptionChange}
						/>
					);
				})}
			</Stack>
		</Box>
	);
}
