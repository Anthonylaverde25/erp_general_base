import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
	Box, 
	Typography, 
	Divider, 
	Fade, 
	IconButton,
	Button
} from '@mui/material';
import { Close, Security, Save } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';

import useCreateRole from '@/features/roles/hooks/useCreateRole';
import { CreateRoleFormType, createRoleSchema } from '@/schemas/role/role.schema';
import { defaultCreateRoleValues } from '@/schemas/role/role.defaults';
import { ICreateRole } from '@/types/role.types';
import axiosInstance from '@/lib/@axios';

// Importar subcomponentes modularizados
import RoleInfoStep from './components/RoleInfoStep';
import SelectPermissionsDialog from './components/SelectPermissionsDialog';

interface CreateRoleFormProps {
	onCancel: () => void;
	onSuccess?: () => void;
}

export default function CreateRoleForm({ onCancel, onSuccess }: CreateRoleFormProps) {
	const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
	const [allPermissions, setAllPermissions] = useState(false);
	const { handleCreateRole, isLoading } = useCreateRole();

	// Consultar catálogo de permisos reales
	const { data: modulesCatalog, isLoading: isLoadingCatalog } = useQuery({
		queryKey: ['permissions-catalog'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/permissions/catalog');
			return data.data;
		}
	});

	const { control, formState, handleSubmit, setValue, watch } = useForm<CreateRoleFormType>({
		mode: 'onChange',
		resolver: zodResolver(createRoleSchema),
		defaultValues: defaultCreateRoleValues
	});

	const { errors, isValid } = formState;
	const selectedPermissions = watch('permissions') || [];

	const totalPermsCount = modulesCatalog 
		? modulesCatalog.flatMap((m: any) => m.permissions || []).length 
		: 0;

	// Sincronizar el estado del switch "Permisos totales"
	useEffect(() => {
		if (modulesCatalog && totalPermsCount > 0) {
			const isAllSelected = selectedPermissions.length === totalPermsCount;
			setAllPermissions(isAllSelected);
		}
	}, [selectedPermissions, modulesCatalog, totalPermsCount]);

	const handleToggleAllPermissions = (checked: boolean) => {
		setAllPermissions(checked);
		if (checked && modulesCatalog) {
			const allIds = modulesCatalog.flatMap((module: any) => 
				(module.permissions || []).map((p: any) => p.id)
			);
			setValue('permissions', allIds, { shouldValidate: true });
		} else {
			setValue('permissions', [], { shouldValidate: true });
		}
	};

	const onSubmit = async (data: ICreateRole) => {
		try {
			await handleCreateRole(data);
			onSuccess?.();
			onCancel();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Fade
			in
			timeout={400}
		>
			<Box sx={{ width: '100%' }}>
				{/* Fixed Header */}
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
							sx={{ fontSize: '1.15rem', color: 'text.primary' }}
						>
							Crear nuevo rol
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mt: 0.5, fontSize: '0.875rem' }}
						>
							Complete la información y configure los accesos
						</Typography>
					</Box>
					<IconButton 
						onClick={onCancel} 
						size="small" 
						disabled={isLoading} 
						sx={{ color: '#4b5563', borderRadius: 0 }}
					>
						<Close sx={{ fontSize: 20 }} />
					</IconButton>
				</Box>
				
				<Divider />

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Scrollable Body */}
					<Box
						sx={{
							p: 3,
							display: 'flex',
							flexDirection: 'column',
							gap: 2.5,
							maxHeight: '65vh',
							overflowY: 'auto'
						}}
					>
						<RoleInfoStep
							control={control}
							errors={errors}
							isLoading={isLoading}
							isLoadingCatalog={isLoadingCatalog}
							allPermissions={allPermissions}
							onToggleAllPermissions={handleToggleAllPermissions}
						/>

						{/* Panel de Configuración de Accesos */}
						<Box 
							sx={{ 
								border: '1px solid', 
								borderColor: 'divider', 
								p: 2, 
								mt: 1,
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								bgcolor: 'action.hover',
								borderRadius: 0
							}}
						>
							<Box>
								<Typography variant="body2" fontWeight={700} color="text.primary">
									Accesos y Permisos
								</Typography>
								<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
									{selectedPermissions.length} permisos seleccionados actualmente
								</Typography>
							</Box>
							<Button 
								type="button" 
								variant="outlined" 
								onClick={() => setIsPermissionsOpen(true)}
								startIcon={<Security fontSize="small" />}
								sx={{ 
									borderRadius: 0, 
									textTransform: 'none', 
									fontWeight: 600, 
									fontSize: '0.8125rem',
									bgcolor: '#ffffff',
									color: '#374151',
									borderColor: '#d1d5db',
									border: '1px solid',
									'&:hover': {
										bgcolor: '#f9fafb',
										borderColor: '#c5c9d1'
									}
								}}
							>
								Configurar Permisos
							</Button>
						</Box>
					</Box>

					{/* Fixed Actions Footer */}
					<Divider />

					<Box
						sx={{
							p: 3,
							bgcolor: '#f3f4f6',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Button
							key="cancel-btn"
							type="button"
							onClick={onCancel}
							disabled={isLoading}
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
							key="submit-btn"
							type="submit"
							variant="contained"
							color="primary"
							disabled={!isValid || isLoading}
							startIcon={<Save fontSize="small" />}
							sx={{
								borderRadius: 0,
								px: 4,
								py: 0.75,
								textTransform: 'none',
								fontWeight: 600,
								fontSize: '0.8125rem'
							}}
						>
							{isLoading ? 'Guardando...' : 'Crear rol'}
						</Button>
					</Box>
				</form>

				{/* Modal de Configuración Detallada de Permisos */}
				<SelectPermissionsDialog
					open={isPermissionsOpen}
					onClose={() => setIsPermissionsOpen(false)}
					selectedPermissions={selectedPermissions}
					onSave={(perms) => setValue('permissions', perms, { shouldValidate: true })}
					roleDetails={{
						name: watch('name'),
						code: watch('code'),
						active: watch('active'),
						description: watch('description')
					}}
					modulesCatalog={modulesCatalog || []}
					isLoadingCatalog={isLoadingCatalog}
				/>
			</Box>
		</Fade>
	);
}
