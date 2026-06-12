import { useTenantModules } from '@/contexts/TenantModulesContext';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { Bell, LayoutGrid, Search, X } from 'lucide-react';

interface AppLauncherHeaderProps {
	onClose: () => void;
}

export function AppLauncherHeader({ onClose }: AppLauncherHeaderProps) {
	const modulesInfo = useTenantModules();
	console.log('Available Modules:', modulesInfo.available);
	console.log('Licensed Modules:', modulesInfo.licensed);
	console.log('Has POS Module?', modulesInfo.hasModule('pos'));
	return (
		<Box
			sx={{
				height: 60,
				px: 2.5,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				backgroundColor: '#334b63',
				color: '#fff'
			}}
		>
			<Box className="flex items-center gap-3">
				<IconButton size="small" sx={{ color: 'inherit' }}>
					<LayoutGrid size={18} />
				</IconButton>
				<Typography className="text-sm font-semibold tracking-wide">ERP</Typography>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderColor: 'rgba(255,255,255,0.18)' }}
				/>
				<Typography className="text-lg font-medium">App Launcher</Typography>
			</Box>

			<Box className="flex items-center gap-1">
				<IconButton size="small" sx={{ color: 'inherit' }}>
					<Search size={18} />
				</IconButton>
				<IconButton size="small" sx={{ color: 'inherit' }}>
					<Bell size={18} />
				</IconButton>
				<IconButton size="small" sx={{ color: 'inherit' }} onClick={onClose}>
					<X size={18} />
				</IconButton>
			</Box>
		</Box>
	);
}
