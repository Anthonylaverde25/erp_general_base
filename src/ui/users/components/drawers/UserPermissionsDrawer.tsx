import React, { useState, useEffect } from 'react';
import { 
	Box, 
	Drawer, 
	Divider, 
	CircularProgress, 
	Typography 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';
import useShowUser from '@/features/users/hooks/useShowUser';
import useUpdateUserPermissions from '@/features/users/hooks/useUpdateUserPermissions';

// Subcomponentes modulares
import DrawerHeader from './components/DrawerHeader';
import DrawerFooter from './components/DrawerFooter';
import ModuleTabs from './components/ModuleTabs';
import ModuleSection from './components/ModuleSection';

interface UserPermissionsDrawerProps {
	open: boolean;
	onClose: () => void;
	userId: number | null;
}

export default function UserPermissionsDrawer({ open, onClose, userId }: UserPermissionsDrawerProps) {
	const [activeTab, setActiveTab] = useState<string>('all');
	
	// Estado local para almacenar las excepciones editadas temporalmente
	// Mapea permissionId -> boolean | null (true = allowed, false = denied, null = inherited)
	const [localExceptions, setLocalExceptions] = useState<Record<number, boolean | null>>({});

	const { user, isLoading: isLoadingUser, isError: isErrorUser } = useShowUser(userId || 0);
	const { handleUpdateUserPermissions, isLoading: isSaving } = useUpdateUserPermissions();

	// Consultar catálogo de permisos completo
	const { data: modulesCatalog, isLoading: isLoadingCatalog } = useQuery({
		queryKey: ['permissions-catalog'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/permissions/catalog');
			return data.data;
		},
		enabled: open
	});

	// Inicializar excepciones locales cuando el usuario y catálogo se cargan
	useEffect(() => {
		if (user && modulesCatalog) {
			const initialExc: Record<number, boolean | null> = {};
			
			// 1. Inicializar todos los permisos del catálogo en null (Heredar)
			modulesCatalog.forEach((module: any) => {
				(module.permissions || []).forEach((perm: any) => {
					initialExc[perm.id] = null;
				});
			});

			// 2. Cargar excepciones guardadas del usuario en la base de datos
			if (user.exceptions && Array.isArray(user.exceptions)) {
				user.exceptions.forEach((exc: any) => {
					initialExc[exc.id] = exc.allowed;
				});
			}
			
			setLocalExceptions(initialExc);
		}
	}, [user, modulesCatalog, open]);

	const isLoading = isLoadingUser || isLoadingCatalog;
	const isError = isErrorUser || !userId;

	// Obtener lista filtrada de módulos
	const filteredModules = modulesCatalog 
		? activeTab === 'all' 
			? modulesCatalog 
			: modulesCatalog.filter((m: any) => m.code === activeTab)
		: [];

	// Conteo de excepciones activas configuradas localmente
	const activeExceptionsCount = Object.values(localExceptions).filter(val => val !== null).length;

	const handleExceptionChange = (permissionId: number, value: string | null) => {
		let allowedValue: boolean | null = null;
		if (value === 'allow') allowedValue = true;
		if (value === 'deny') allowedValue = false;

		setLocalExceptions(prev => ({
			...prev,
			[permissionId]: allowedValue
		}));
	};

	const handleSave = async () => {
		if (!userId) return;

		// Convertir el estado local en el formato esperado por el backend
		const payload = Object.entries(localExceptions).map(([id, allowed]) => ({
			id: Number(id),
			allowed
		}));

		try {
			await handleUpdateUserPermissions(userId, payload);
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}
		>
			{/* Cabecera */}
			<DrawerHeader 
				user={user} 
				onClose={onClose} 
				isSaving={isSaving} 
			/>
			<Divider />

			{/* Cuerpo del Drawer */}
			<Box sx={{ flexGrow: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
				{isLoading ? (
					<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
						<CircularProgress size={32} />
					</Box>
				) : isError || !user || !modulesCatalog ? (
					<Box sx={{ flexGrow: 1, p: 3, textAlign: 'center' }}>
						<Typography color="error" variant="body2">
							No se pudo cargar la configuración de permisos del usuario.
						</Typography>
					</Box>
				) : (
					<>
						{/* Barra Lateral de Pestañas */}
						<ModuleTabs 
							modulesCatalog={modulesCatalog} 
							activeTab={activeTab} 
							onTabChange={setActiveTab} 
						/>

						{/* Listado de Permisos por Módulo */}
						<Box sx={{ flexGrow: 1, p: 2.5, overflowY: 'auto' }}>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
								{filteredModules.map((module: any) => (
									<ModuleSection
										key={module.id}
										module={module}
										user={user}
										localExceptions={localExceptions}
										onExceptionChange={handleExceptionChange}
									/>
								))}
							</Box>
						</Box>
					</>
				)}
			</Box>

			{/* Footer con Botones de Acción */}
			<DrawerFooter 
				activeExceptionsCount={activeExceptionsCount} 
				isSaving={isSaving} 
				isLoading={isLoading} 
				onClose={onClose} 
				onSave={handleSave} 
			/>
		</Drawer>
	);
}
