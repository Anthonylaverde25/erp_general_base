import { Box, Dialog, IconButton, Tooltip } from '@mui/material';
import { LayoutGrid } from 'lucide-react';
import { useAppLauncher } from './hooks/useAppLauncher';
import { AppLauncherHeader } from './views/AppLauncherHeader';
import { AppLauncherSidebar } from './views/AppLauncherSidebar';
import { SubSidebarPanel } from './views/panels/SubSidebarPanel';
import { HomePanel } from './views/panels/HomePanel';

export function AppLauncher() {
	const launcher = useAppLauncher();

	return (
		<Box className="flex items-center">
			<Tooltip title="Aplicaciones">
				<IconButton
					onClick={launcher.handleOpen}
					size="small"
					sx={{ ml: 1 }}
					aria-controls={launcher.open ? 'app-launcher-dialog' : undefined}
					aria-haspopup="true"
					aria-expanded={launcher.open ? 'true' : undefined}
				>
					<LayoutGrid className="text-20" />
				</IconButton>
			</Tooltip>

			<Dialog
				id="app-launcher-dialog"
				open={launcher.open}
				onClose={launcher.handleClose}
				maxWidth={false}
				slotProps={{
					backdrop: {
						sx: {
							backgroundColor: 'rgba(226, 232, 240, 0.72)',
							backdropFilter: 'blur(4px)'
						}
					},
					paper: {
						elevation: 0,
						sx: {
							width: 'min(1220px, calc(100vw - 32px))',
							height: 'min(760px, calc(100vh - 56px))',
							maxWidth: 'none',
							maxHeight: 'none',
							borderRadius: 0,
							border: '1px solid rgba(15, 23, 42, 0.12)',
							boxShadow: '0 30px 70px rgba(15, 23, 42, 0.22)',
							overflow: 'hidden',
							backgroundColor: '#eef3f8'
						}
					}
				}}
			>
				<Box className="flex h-full flex-col">
					<AppLauncherHeader onClose={launcher.handleClose} />

					<Box className="flex min-h-0 flex-1">
						<AppLauncherSidebar
							mode={launcher.sidebarMode}
							setMode={launcher.setSidebarMode}
						/>

						<SubSidebarPanel
							mode={launcher.sidebarMode}
							availableApps={launcher.availableApps}
							activeApps={launcher.activeApps}
							handleActivateApp={launcher.handleActivateApp}
						/>

						<HomePanel
							activeApps={launcher.activeApps}
							extensions={launcher.extensions}
							executeAppAction={launcher.executeAppAction}
							onClose={launcher.handleClose}
						/>
					</Box>
				</Box>
			</Dialog>
		</Box>
	);
}

export default AppLauncher;
