import { Box, IconButton } from '@mui/material';
import { Boxes, Grid2x2, Headphones, History } from 'lucide-react';
import { SidebarMode } from '../types';

interface AppLauncherSidebarProps {
	mode: SidebarMode;
	setMode: (mode: SidebarMode) => void;
}

export function AppLauncherSidebar({ mode, setMode }: AppLauncherSidebarProps) {
	return (
		<Box
			sx={{
				width: 70,
				borderRight: '1px solid rgba(148, 163, 184, 0.28)',
				backgroundColor: '#f8fafc',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'space-between'
			}}
		>
			<Box className="flex w-full flex-col items-center py-4">
				<SidebarButton
					icon={Grid2x2}
					isActive={mode === 'home'}
					onClick={() => setMode('home')}
				/>
				<SidebarButton
					icon={Boxes}
					isActive={mode === 'available'}
					onClick={() => setMode('available')}
				/>
				<SidebarButton
					icon={History}
					isActive={mode === 'recent'}
					onClick={() => setMode('recent')}
				/>
			</Box>

			<Box className="flex w-full justify-center py-5 text-slate-500">
				<Headphones size={22} />
			</Box>
		</Box>
	);
}

function SidebarButton({
	icon: Icon,
	isActive,
	onClick
}: {
	icon: React.ElementType;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<IconButton
			onClick={onClick}
			sx={{
				width: '100%',
				borderRadius: 0,
				py: 2,
				color: isActive ? '#0b57d0' : '#64748b',
				borderLeft: isActive ? '3px solid #0b57d0' : '3px solid transparent',
				backgroundColor: isActive ? 'rgba(11, 87, 208, 0.07)' : 'transparent'
			}}
		>
			<Icon size={22} />
		</IconButton>
	);
}
