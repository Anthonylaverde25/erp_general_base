import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { UserEntity } from '@/domain/entities/users/User';

interface DrawerHeaderProps {
	user: UserEntity | null;
	onClose: () => void;
	isSaving: boolean;
}

export default function DrawerHeader({ user, onClose, isSaving }: DrawerHeaderProps) {
	return (
		<Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<Stack spacing={0.5}>
				<Typography variant="h6" fontWeight={750} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<FuseSvgIcon size={20} color="primary">heroicons-outline:shield-check</FuseSvgIcon>
					Configuración de Permisos
				</Typography>
				{user && (
					<Typography variant="caption" color="text.secondary">
						Configurando accesos especiales para <strong>{user.name} {user.last_name || ''}</strong> ({user.role?.name})
					</Typography>
				)}
			</Stack>
			<IconButton size="small" onClick={onClose} disabled={isSaving}>
				<FuseSvgIcon size={18}>heroicons-outline:x-mark</FuseSvgIcon>
			</IconButton>
		</Box>
	);
}
