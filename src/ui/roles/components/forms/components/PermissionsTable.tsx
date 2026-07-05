import React, { useState } from 'react';
import { 
	Box, 
	Stack, 
	Typography, 
	Chip, 
	Button, 
	Checkbox, 
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	alpha,
	useTheme
} from '@mui/material';
import { 
	ShoppingCart, 
	ShoppingBag, 
	Storefront, 
	Inventory, 
	People, 
	Settings, 
	FolderOpen,
	ListAlt
} from '@mui/icons-material';

interface PermissionsTableProps {
	modulesCatalog: any[];
	selectedPermissions: number[];
	onTogglePermission: (id: number) => void;
	onSelectAllModule: (modulePermissions: any[], isAllSelected: boolean) => void;
}

const getModuleIcon = (code: string) => {
	switch (code) {
		case 'sales': return ShoppingCart;
		case 'purchases': return ShoppingBag;
		case 'pos': return Storefront;
		case 'inventory': return Inventory;
		case 'hr': return People;
		case 'settings': return Settings;
		default: return FolderOpen;
	}
};

export default function PermissionsTable({
	modulesCatalog,
	selectedPermissions,
	onTogglePermission,
	onSelectAllModule
}: PermissionsTableProps) {
	const theme = useTheme();
	const [activeTab, setActiveTab] = useState<string>('all');

	// Filtrar catálogo según la pestaña seleccionada
	const filteredModules = activeTab === 'all' 
		? modulesCatalog 
		: modulesCatalog.filter(m => m.code === activeTab);

	// Contar totales para la pestaña "Todos los Módulos"
	const totalPermissionsCount = modulesCatalog.flatMap(m => m.permissions || []).length;
	const activePermissionsCount = selectedPermissions.length;

	return (
		<Box sx={{ display: 'flex', minHeight: '440px', gap: 2.5 }}>
			{/* Barra Lateral Compacta */}
			<Box 
				sx={{ 
					width: '290px', 
					flexShrink: 0, 
					borderRight: '1px solid', 
					borderColor: 'divider',
					pr: 1.5
				}}
			>
				<List  component="nav" sx={{ p: 0 }}>
					{/* Pestaña: Todos los Módulos */}
					<ListItemButton
						selected={activeTab === 'all'}
						onClick={() => setActiveTab('all')}
						sx={{
							borderRadius: '0px',
							mb: 0.5,
							py: 1,
							'&.Mui-selected': {
								bgcolor: alpha(theme.palette.primary.main, 0.08),
								borderLeft: `3px solid ${theme.palette.primary.main}`,
								'&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
							}
						}}
					>
						<ListItemIcon sx={{ minWidth: 32, color: activeTab === 'all' ? 'primary.main' : 'text.secondary' }}>
							<ListAlt fontSize="small" />
						</ListItemIcon>
						<ListItemText 
							primary={
								<Typography variant="body2" fontWeight={activeTab === 'all' ? 700 : 500} sx={{ fontSize: '0.8125rem' }}>
									Todos los Módulos
								</Typography>
							}
							secondary={
								<Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
									{activePermissionsCount} / {totalPermissionsCount} activos
								</Typography>
							}
						/>
					</ListItemButton>

					<Divider sx={{ my: 1 }} />

					{/* Lista de Módulos */}
					{modulesCatalog.map((module) => {
						const modulePerms = module.permissions || [];
						if (modulePerms.length === 0) return null;

						const modulePermsIds = modulePerms.map((p: any) => p.id);
						const activeCount = selectedPermissions.filter(id => modulePermsIds.includes(id)).length;
						const TabIcon = getModuleIcon(module.code);
						const isSelected = activeTab === module.code;

						return (
							<ListItemButton
								key={module.id}
								selected={isSelected}
								onClick={() => setActiveTab(module.code)}
								sx={{
									borderRadius: '0px',
									mb: 0.25,
									py: 0.75,
									'&.Mui-selected': {
										bgcolor: alpha(theme.palette.primary.main, 0.08),
										borderLeft: `3px solid ${theme.palette.primary.main}`,
										'&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
									}
								}}
							>
								<ListItemIcon sx={{ minWidth: 32, color: isSelected ? 'primary.main' : 'text.secondary' }}>
									<TabIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText 
									primary={
										<Typography variant="body2" fontWeight={isSelected ? 700 : 500} sx={{ fontSize: '0.8125rem' }}>
											{module.name}
										</Typography>
									}
									secondary={
										<Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px' }}>
											{activeCount} de {modulePerms.length} activos
										</Typography>
									}
								/>
							</ListItemButton>
						);
					})}
				</List>
			</Box>

			{/* Panel Detalle de Permisos de Alta Densidad */}
			<Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '500px', pr: 1 }}>
				<Stack spacing={3}>
					{filteredModules.map((module) => {
						const modulePerms = module.permissions || [];
						if (modulePerms.length === 0) return null;
						const modulePermsIds = modulePerms.map((p: any) => p.id);
						const activeModulePerms = selectedPermissions.filter(id => modulePermsIds.includes(id));
						const isAllSelected = activeModulePerms.length === modulePerms.length;
						const TabIcon = getModuleIcon(module.code);

						return (
							<Box key={module.id} sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
								{/* Cabecera del Panel */}
								<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 1.5 }}>
									<Stack direction="row" alignItems="center" spacing={1}>
										<Box sx={{
											p: 0.5,
											display: 'flex',
											bgcolor: alpha(theme.palette.primary.main, 0.08),
											color: 'primary.main',
											borderRadius: '3px'
										}}>
											<TabIcon sx={{ fontSize: 16 }} />
										</Box>
										<Typography variant="body2" fontWeight={750} color="text.primary" sx={{ fontSize: '0.875rem' }}>
											{module.name}
										</Typography>
									</Stack>

									<Stack direction="row" alignItems="center" spacing={1.5}>
										<Chip 
											label={`${activeModulePerms.length} / ${modulePerms.length}`} 
											size="small" 
											color={activeModulePerms.length > 0 ? 'primary' : 'default'}
											sx={{ fontWeight: 700, borderRadius: '2px', height: 20, fontSize: '10px' }}
										/>
										<Button
											size="small"
											variant="text"
											onClick={() => onSelectAllModule(modulePerms, isAllSelected)}
											sx={{ textTransform: 'none', fontWeight: 750, fontSize: '0.7rem', py: 0 }}
										>
											{isAllSelected ? 'Quitar todos' : 'Marcar todos'}
										</Button>
									</Stack>
								</Stack>

								{/* Fila compacta SAP */}
								<Stack spacing={0.5}>
									{modulePerms.map((permission: any) => {
										const isChecked = selectedPermissions.includes(permission.id);
										return (
											<Box
												key={permission.id}
												onClick={() => onTogglePermission(permission.id)}
												sx={{
													py: 0.75,
													px: 1.2,
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													borderBottom: '1px solid',
													borderColor: '#f1f5f9',
													transition: 'all 0.1s',
													'&:hover': {
														bgcolor: 'action.hover'
													}
												}}
											>
												<Stack direction="row" alignItems="center" spacing={1.5} sx={{ overflow: 'hidden' }}>
													<Checkbox
														checked={isChecked}
														onChange={(e) => {
															e.stopPropagation();
															onTogglePermission(permission.id);
														}}
														color="primary"
														size="small"
														sx={{ p: 0 }}
													/>
													<Box sx={{ display: 'flex', flexDirection: 'column' }}>
														<Typography 
															variant="body2" 
															fontWeight={600}
															color="text.primary"
															sx={{ fontSize: '0.8125rem', lineHeight: 1.2 }}
														>
															{permission.name}
														</Typography>
														{permission.description && (
															<Typography 
																variant="caption" 
																color="text.secondary"
																sx={{ fontSize: '0.7rem', lineHeight: 1.2, display: 'block', mt: 0.2 }}
															>
																{permission.description}
															</Typography>
														)}
													</Box>
												</Stack>
												
												{/* Slug Técnico Monospace (Estilo SAP) */}
												<Chip
													label={permission.slug}
													size="small"
													sx={{
														fontFamily: 'monospace',
														fontSize: '9px',
														height: '16px',
														bgcolor: alpha(theme.palette.primary.main, 0.05),
														color: 'primary.main',
														borderRadius: '2px',
														border: '1px solid',
														borderColor: alpha(theme.palette.primary.main, 0.15)
													}}
												/>
											</Box>
										);
									})}
								</Stack>
							</Box>
						);
					})}
				</Stack>
			</Box>
		</Box>
	);
}
