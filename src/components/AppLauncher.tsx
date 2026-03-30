import { useMemo, useState } from 'react';
import { Box, Button, Dialog, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import {
	Award,
	BarChart3,
	Bell,
	Boxes,
	Building2,
	CalendarDays,
	Grid2x2,
	Headphones,
	History,
	LayoutGrid,
	Lock,
	Monitor,
	Search,
	Settings2,
	Sparkles,
	Store,
	Users,
	WalletCards,
	X
} from 'lucide-react';

type LauncherApp = {
	id: string;
	name: string;
	description: string;
	badge?: string;
	icon: typeof LayoutGrid;
	action: () => void;
	accent?: string;
};

type LauncherExtension = {
	id: string;
	name: string;
	description: string;
	icon: typeof LayoutGrid;
};

function AppLauncher() {
	const [open, setOpen] = useState(false);
	const [sidebarMode, setSidebarMode] = useState<'home' | 'available' | 'recent'>('home');
	const [activeAppIds, setActiveAppIds] = useState<string[]>([
		'erp',
		'sales',
		'crm',
		'pos',
		'settings',
		'inventory',
		'calendar',
		'finance'
	]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleActivateApp = (appId: string) => {
		setActiveAppIds((current) => (current.includes(appId) ? current : [...current, appId]));
	};

	const posUrl =
		window.location.hostname === 'localhost'
			? 'http://localhost:4000'
			: `https://pos.${window.location.hostname.replace('app.', '')}`;

	const allApps = useMemo<LauncherApp[]>(
		() => [
			{
				id: 'erp',
				name: 'ERP Administrativo',
				description: 'Gestion global, documentos y operaciones.',
				badge: 'ACTIVE',
				icon: Building2,
				accent: '#0b57d0',
				action: () => window.open(`${window.location.origin}/dashboard`, '_self')
			},
			{
				id: 'sales',
				name: 'Ventas',
				description: 'Presupuestos, pedidos y facturacion comercial.',
				badge: 'CORE',
				icon: BarChart3,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/sales`, '_self')
			},
			{
				id: 'crm',
				name: 'Partners CRM',
				description: 'Clientes, contactos y seguimiento comercial.',
				badge: 'LIVE',
				icon: Users,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/partners`, '_self')
			},
			{
				id: 'pos',
				name: 'Punto de Venta',
				description: 'Venta rapida, caja y operacion retail.',
				badge: 'REAL-TIME',
				icon: Store,
				accent: '#2563eb',
				action: () => window.open(posUrl, '_blank', 'noopener,noreferrer')
			},
			{
				id: 'settings',
				name: 'Configuracion',
				description: 'Usuarios, permisos y ajustes del sistema.',
				badge: 'ADMIN',
				icon: Settings2,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/settings`, '_self')
			},
			{
				id: 'inventory',
				name: 'Inventario',
				description: 'Stock, trazabilidad y control operativo.',
				badge: 'OPS',
				icon: Boxes,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/items`, '_self')
			},
			{
				id: 'calendar',
				name: 'Agenda',
				description: 'Visitas, tareas y eventos del equipo.',
				badge: 'NEW',
				icon: CalendarDays,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/dashboard`, '_self')
			},
			{
				id: 'finance',
				name: 'Finanzas',
				description: 'Cobros, pagos y conciliacion general.',
				badge: 'SUITE',
				icon: WalletCards,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/purchases`, '_self')
			},
			{
				id: 'staffing',
				name: 'Staffing',
				description: 'Turnos, asistencia y coordinacion del equipo.',
				badge: 'AVAILABLE',
				icon: CalendarDays,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/dashboard`, '_self')
			},
			{
				id: 'pricing',
				name: 'Price Rules',
				description: 'Descuentos, margenes y reglas comerciales.',
				badge: 'AVAILABLE',
				icon: WalletCards,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/sales`, '_self')
			},
			{
				id: 'analytics',
				name: 'Analytics Hub',
				description: 'KPIs avanzados e inteligencia de negocio.',
				badge: 'AVAILABLE',
				icon: BarChart3,
				accent: '#2563eb',
				action: () => window.open(`${window.location.origin}/dashboard`, '_self')
			}
		],
		[posUrl]
	);

	const activeApps = useMemo(() => allApps.filter((app) => activeAppIds.includes(app.id)), [activeAppIds, allApps]);

	const availableApps = useMemo(
		() => allApps.filter((app) => !activeAppIds.includes(app.id)),
		[activeAppIds, allApps]
	);

	const extensions = useMemo<LauncherExtension[]>(
		() => [
			{
				id: 'loyalty',
				name: 'Loyalty',
				description: 'Programas de puntos y recompensas.',
				icon: Award
			},
			{
				id: 'advisor',
				name: 'AI Advisor',
				description: 'Sugerencias, alertas e insights predictivos.',
				icon: Sparkles
			},
			{
				id: 'desktop',
				name: 'Desktop Agent',
				description: 'Sincronizacion local y tareas en segundo plano.',
				icon: Monitor
			}
		],
		[]
	);

	return (
		<Box className="flex items-center">
			<Tooltip title="Aplicaciones">
				<IconButton
					onClick={handleOpen}
					size="small"
					sx={{ ml: 1 }}
					aria-controls={open ? 'app-launcher-dialog' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<LayoutGrid className="text-20" />
				</IconButton>
			</Tooltip>

			<Dialog
				id="app-launcher-dialog"
				open={open}
				onClose={handleClose}
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
							<IconButton
								size="small"
								sx={{ color: 'inherit' }}
							>
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
							<IconButton
								size="small"
								sx={{ color: 'inherit' }}
							>
								<Search size={18} />
							</IconButton>
							<IconButton
								size="small"
								sx={{ color: 'inherit' }}
							>
								<Bell size={18} />
							</IconButton>
							<IconButton
								size="small"
								sx={{ color: 'inherit' }}
								onClick={handleClose}
							>
								<X size={18} />
							</IconButton>
						</Box>
					</Box>

					<Box className="flex min-h-0 flex-1">
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
								<IconButton
									onClick={() => setSidebarMode('home')}
									sx={{
										width: '100%',
										borderRadius: 0,
										py: 2,
										color: sidebarMode === 'home' ? '#0b57d0' : '#64748b',
										borderLeft:
											sidebarMode === 'home' ? '3px solid #0b57d0' : '3px solid transparent',
										backgroundColor:
											sidebarMode === 'home' ? 'rgba(11, 87, 208, 0.07)' : 'transparent'
									}}
								>
									<Grid2x2 size={22} />
								</IconButton>
								<IconButton
									onClick={() => setSidebarMode('available')}
									sx={{
										width: '100%',
										borderRadius: 0,
										py: 2,
										color: sidebarMode === 'available' ? '#0b57d0' : '#64748b',
										borderLeft:
											sidebarMode === 'available' ? '3px solid #0b57d0' : '3px solid transparent',
										backgroundColor:
											sidebarMode === 'available' ? 'rgba(11, 87, 208, 0.07)' : 'transparent'
									}}
								>
									<Boxes size={22} />
								</IconButton>
								<IconButton
									onClick={() => setSidebarMode('recent')}
									sx={{
										width: '100%',
										borderRadius: 0,
										py: 2,
										color: sidebarMode === 'recent' ? '#0b57d0' : '#64748b',
										borderLeft:
											sidebarMode === 'recent' ? '3px solid #0b57d0' : '3px solid transparent',
										backgroundColor:
											sidebarMode === 'recent' ? 'rgba(11, 87, 208, 0.07)' : 'transparent'
									}}
								>
									<History size={22} />
								</IconButton>
							</Box>

							<Box className="flex w-full justify-center py-5 text-slate-500">
								<Headphones size={22} />
							</Box>
						</Box>

						{sidebarMode !== 'home' && (
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
										{sidebarMode === 'available' ? 'Apps Disponibles' : 'Recientes'}
									</Typography>
									<Typography className="mt-2 text-2xl font-light tracking-tight text-slate-900">
										{sidebarMode === 'available'
											? 'Aplicaciones para activar'
											: 'Actividad reciente'}
									</Typography>
								</Box>

								<Box className="min-h-0 flex-1 overflow-y-auto p-2">
									{sidebarMode === 'available' &&
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

									{sidebarMode === 'recent' && (
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
															<Icon
																size={18}
																color={app.accent || '#2563eb'}
															/>
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
						)}

						<Box className="flex min-w-0 flex-1 flex-col bg-[#f8fafc]">
							<Box className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
								<Box className="mb-8">
									<Box className="mb-4 flex items-baseline gap-3">
										<Typography className="text-4xl font-light tracking-tight text-slate-900">
											My Home
										</Typography>
										<Typography className="text-sm text-slate-500">
											({activeApps.length} Applications)
										</Typography>
									</Box>

									<Box
										sx={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
											gap: 2
										}}
									>
										{activeApps.map((app) => {
											const Icon = app.icon;

											return (
												<Box
													key={app.id}
													onClick={() => {
														handleClose();
														app.action();
													}}
													sx={{
														minHeight: 172,
														cursor: 'pointer',
														border: '1px solid rgba(148, 163, 184, 0.28)',
														backgroundColor: '#fff',
														p: 2.5,
														transition:
															'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
														'&:hover': {
															transform: 'translateY(-3px)',
															borderColor: 'rgba(37, 99, 235, 0.4)',
															boxShadow: '0 18px 40px rgba(37, 99, 235, 0.12)'
														}
													}}
												>
													<Box className="mb-7 flex items-start justify-between">
														<Icon
															size={24}
															color={app.accent || '#2563eb'}
														/>
														{app.badge && (
															<Typography className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
																{app.badge}
															</Typography>
														)}
													</Box>

													<Typography className="mb-1.5 text-[15px] font-semibold text-slate-900">
														{app.name}
													</Typography>
													<Typography className="text-sm leading-5 text-slate-500">
														{app.description}
													</Typography>
												</Box>
											);
										})}
									</Box>
								</Box>

								<Box>
									<Box className="mb-4 flex items-center gap-4">
										<Typography className="text-3xl font-light tracking-tight text-slate-600">
											Available Extensions
										</Typography>
										<Box className="h-px flex-1 bg-slate-300" />
									</Box>

									<Box
										sx={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
											gap: 2,
											maxWidth: 600
										}}
									>
										{extensions.map((extension) => {
											const Icon = extension.icon;

											return (
												<Box
													key={extension.id}
													sx={{
														minHeight: 152,
														border: '1px solid rgba(203, 213, 225, 0.7)',
														backgroundColor: 'rgba(255,255,255,0.55)',
														p: 2.5,
														opacity: 0.74
													}}
												>
													<Box className="mb-9 flex items-start justify-between">
														<Icon
															size={24}
															color="#6b7280"
														/>
														<Lock
															size={14}
															color="#6b7280"
														/>
													</Box>
													<Typography className="mb-1.5 text-[15px] font-semibold text-slate-600">
														{extension.name}
													</Typography>
													<Typography className="text-sm leading-5 text-slate-500">
														{extension.description}
													</Typography>
												</Box>
											);
										})}
									</Box>
								</Box>
							</Box>

							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									px: 3,
									py: 1.5,
									backgroundColor: '#ffffff',
									borderTop: '1px solid rgba(148, 163, 184, 0.28)'
								}}
							>
								<Button
									startIcon={<Lock size={16} />}
									sx={{
										color: '#0b57d0',
										fontWeight: 700,
										textTransform: 'none'
									}}
								>
									App Permissions
								</Button>

								<Box className="flex items-center gap-1.5">
									<Button
										variant="outlined"
										onClick={handleClose}
										sx={{
											minWidth: 112,
											height: 46,
											borderColor: '#2563eb',
											color: '#0b57d0',
											fontWeight: 700,
											textTransform: 'none'
										}}
									>
										Cancel
									</Button>
									<Button
										variant="contained"
										startIcon={<Monitor size={16} />}
										onClick={() => {
											handleClose();
											window.open(`${window.location.origin}/dashboard`, '_self');
										}}
										sx={{
											minWidth: 172,
											height: 46,
											backgroundColor: '#0b57d0',
											fontWeight: 700,
											textTransform: 'none',
											boxShadow: 'none',
											'&:hover': {
												backgroundColor: '#0a4db8',
												boxShadow: 'none'
											}
										}}
									>
										Launch Desktop
									</Button>
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			</Dialog>
		</Box>
	);
}

export default AppLauncher;
