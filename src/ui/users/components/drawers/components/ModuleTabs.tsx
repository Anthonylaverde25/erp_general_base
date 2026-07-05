import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, alpha, useTheme } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface ModuleTabsProps {
	modulesCatalog: any[];
	activeTab: string;
	onTabChange: (code: string) => void;
}

export const getModuleIconName = (code: string): string => {
	switch (code) {
		case 'sales': return 'heroicons-outline:shopping-cart';
		case 'purchases': return 'heroicons-outline:shopping-bag';
		case 'pos': return 'heroicons-outline:building-storefront';
		case 'inventory': return 'heroicons-outline:cube';
		case 'hr': return 'heroicons-outline:users';
		case 'settings': return 'heroicons-outline:cog-6-tooth';
		default: return 'heroicons-outline:folder-open';
	}
};

export default function ModuleTabs({ modulesCatalog, activeTab, onTabChange }: ModuleTabsProps) {
	const theme = useTheme();

	return (
		<Box 
			sx={{ 
				width: '160px', 
				flexShrink: 0, 
				borderRight: '1px solid', 
				borderColor: 'divider',
				overflowY: 'auto',
				bgcolor: '#f8fafc'
			}}
		>
			<List component="nav" sx={{ p: 0 }}>
				<ListItemButton
					selected={activeTab === 'all'}
					onClick={() => onTabChange('all')}
					sx={{
						borderRadius: '0px',
						mb: 0.25,
						py: 1,
						'&.Mui-selected': {
							bgcolor: alpha(theme.palette.primary.main, 0.08),
							borderLeft: `3px solid ${theme.palette.primary.main}`,
							'&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
						}
					}}
				>
					<ListItemIcon sx={{ minWidth: 28, color: activeTab === 'all' ? 'primary.main' : 'text.secondary' }}>
						<FuseSvgIcon size={16}>heroicons-outline:squares-2x2</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText 
						primary={
							<Typography variant="body2" fontWeight={activeTab === 'all' ? 700 : 500} sx={{ fontSize: '0.78rem' }}>
								Todos
							</Typography>
						}
					/>
				</ListItemButton>

				<Divider sx={{ my: 0.5 }} />

				{modulesCatalog.map((module) => {
					const modulePerms = module.permissions || [];
					if (modulePerms.length === 0) return null;

					const isSelected = activeTab === module.code;
					const iconName = getModuleIconName(module.code);

					return (
						<ListItemButton
							key={module.id}
							selected={isSelected}
							onClick={() => onTabChange(module.code)}
							sx={{
								borderRadius: '0px',
								mb: 0.25,
								py: 0.8,
								'&.Mui-selected': {
									bgcolor: alpha(theme.palette.primary.main, 0.08),
									borderLeft: `3px solid ${theme.palette.primary.main}`,
									'&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
								}
							}}
						>
							<ListItemIcon sx={{ minWidth: 28, color: isSelected ? 'primary.main' : 'text.secondary' }}>
								<FuseSvgIcon size={16}>{iconName}</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText 
								primary={
									<Typography variant="body2" fontWeight={isSelected ? 700 : 500} sx={{ fontSize: '0.78rem' }}>
										{module.name}
									</Typography>
								}
							/>
						</ListItemButton>
					);
				})}
			</List>
		</Box>
	);
}
