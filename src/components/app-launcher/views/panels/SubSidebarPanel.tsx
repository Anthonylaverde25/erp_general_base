import { Box, Typography, Button } from '@mui/material';
import { SidebarMode, LauncherApp } from '../../types';

interface SubSidebarPanelProps {
	mode: SidebarMode;
	availableApps: LauncherApp[];
	activeApps: LauncherApp[];
	handleActivateApp: (appId: string) => void;
}

export function SubSidebarPanel({ mode, availableApps, activeApps, handleActivateApp }: SubSidebarPanelProps) {
	if (mode === 'home') return null;

	return (
		<Box
			sx={{
				width: 300,
				borderRight: '1px solid rgba(148, 163, 184, 0.28)',
				backgroundColor: '#ffffff',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<Box
				sx={{
					px: 2.5,
					py: 2.5,
					borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
				}}
			>
				<Typography className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
					{mode === 'available' ? 'Apps Disponibles' : 'Recientes'}
				</Typography>
				<Typography className="mt-2 text-2xl font-light tracking-tight text-slate-900">
					{mode === 'available' ? 'Aplicaciones para activar' : 'Actividad reciente'}
				</Typography>
			</Box>

			<Box className="min-h-0 flex-1 overflow-y-auto p-2">
				{mode === 'available' &&
					availableApps.map((app) => {
						const Icon = app.icon;

						return (
							<Box
								key={app.id}
								sx={{
									mb: 1,
									border: '1px solid rgba(148, 163, 184, 0.2)',
									backgroundColor: '#f8fafc',
									p: 1.75
								}}
							>
								<Box className="mb-3 flex items-start gap-3">
									<Box
										sx={{
											mt: 0.25,
											color: app.accent || '#2563eb'
										}}
									>
										<Icon size={18} />
									</Box>
									<Box>
										<Typography className="text-sm font-semibold text-slate-900">
											{app.name}
										</Typography>
										<Typography className="mt-0.5 text-xs leading-5 text-slate-500">
											{app.description}
										</Typography>
									</Box>
								</Box>

								<Button
									variant="outlined"
									size="small"
									onClick={() => handleActivateApp(app.id)}
									sx={{
										borderColor: '#2563eb',
										color: '#0b57d0',
										fontWeight: 700,
										textTransform: 'none'
									}}
								>
									Activar
								</Button>
							</Box>
						);
					})}

				{mode === 'recent' && (
					<Box className="space-y-2 p-1">
						{activeApps.slice(0, 4).map((app) => {
							const Icon = app.icon;

							return (
								<Box
									key={`${app.id}-recent`}
									sx={{
										border: '1px solid rgba(148, 163, 184, 0.2)',
										backgroundColor: '#f8fafc',
										p: 1.75
									}}
								>
									<Box className="flex items-center gap-3">
										<Icon size={18} color={app.accent || '#2563eb'} />
										<Box>
											<Typography className="text-sm font-semibold text-slate-900">
												{app.name}
											</Typography>
											<Typography className="text-xs text-slate-500">
												Disponible para acceso rapido.
											</Typography>
										</Box>
									</Box>
								</Box>
							);
						})}
					</Box>
				)}
			</Box>
		</Box>
	);
}
