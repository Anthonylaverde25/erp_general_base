import { useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Box, Typography, Button, IconButton, LinearProgress, Divider, useTheme } from '@mui/material';
import { Card, CardContent } from '@/components/ui/card';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

const salesAndPurchasesData = [
	{ name: 'Mar', ventas: 3000, compras: 2000 },
	{ name: 'Abr', ventas: 4500, compras: 2500 },
	{ name: 'May', ventas: 3800, compras: 2200 },
	{ name: 'Jun', ventas: 5000, compras: 3000 },
	{ name: 'Jul', ventas: 6200, compras: 4100 },
	{ name: 'Ago', ventas: 5800, compras: 3800 },
	{ name: 'Sep', ventas: 7100, compras: 4500 },
	{ name: 'Oct', ventas: 6500, compras: 4200 },
	{ name: 'Nov', ventas: 8000, compras: 5000 },
	{ name: 'Dic', ventas: 9500, compras: 6000 },
	{ name: 'Ene', ventas: 7800, compras: 5500 },
	{ name: 'Feb', ventas: 8500, compras: 5800 }
];

const expensesData = [
	{ name: 'Mar', value: 2000 },
	{ name: 'Abr', value: 2500 },
	{ name: 'May', value: 2200 },
	{ name: 'Jun', value: 3000 },
	{ name: 'Jul', value: 4100 },
	{ name: 'Ago', value: 3800 },
	{ name: 'Sep', value: 4500 },
	{ name: 'Oct', value: 4200 },
	{ name: 'Nov', value: 5000 },
	{ name: 'Dic', value: 6000 },
	{ name: 'Ene', value: 5500 },
	{ name: 'Feb', value: 5800 }
];

function DashboardView() {
	const theme = useTheme();
	return (
		<Root
			content={
				<Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100%' }}>
					{/* Sub-header inside content */}
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
						<Box sx={{ display: 'flex', bgcolor: 'text.primary', color: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
							<Button size="small" sx={{ color: 'inherit', textTransform: 'none', fontWeight: 600, px: 2, minWidth: 'auto', borderRadius: 0 }}>
								Resumen
							</Button>
							<Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.2)' }} />
							<IconButton size="small" sx={{ color: 'inherit', borderRadius: 0, p: '4px' }}>
								<MoreVertIcon fontSize="small" />
							</IconButton>
						</Box>
						<Button size="small" sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}>
							Equipo
						</Button>
						<Button size="small" sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}>
							Proyectos
						</Button>

						<Button size="small" startIcon={<AddIcon />} sx={{ ml: 2, textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}>
							Nuevo board
						</Button>

						<Box sx={{ flexGrow: 1 }} />
						<Button size="small" startIcon={<AddIcon />} sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 600 }}>
							Añadir
						</Button>
					</Box>

					{/* Dashboard Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* Ventas */}
						<Card className="p-5 shadow-sm rounded-xl flex flex-col">
							<Typography variant="subtitle1" fontWeight={600} gutterBottom>Ventas</Typography>
							<Typography variant="body2" color="text.secondary" gutterBottom>Año actual</Typography>
							<Typography variant="h4" fontWeight={700} sx={{ mt: 2, textAlign: 'right' }}>0,00€</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 0.5 }}>
								<Typography variant="caption" color="text.secondary">0% del objetivo</Typography>
								<Typography variant="caption" color="success.main" fontWeight={600}>0,00€</Typography>
							</Box>
							<LinearProgress variant="determinate" value={0} sx={{ height: 4, borderRadius: 2, bgcolor: 'divider' }} />
						</Card>

						{/* Gastos */}
						<Card className="p-5 shadow-sm rounded-xl flex flex-col">
							<Typography variant="subtitle1" fontWeight={600} gutterBottom>Gastos</Typography>
							<Typography variant="body2" color="text.secondary" gutterBottom>Año actual</Typography>
							<Typography variant="h4" fontWeight={700} sx={{ mt: 2, textAlign: 'right' }}>0,00€</Typography>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 0.5 }}>
								<Typography variant="caption" color="text.secondary">0% del objetivo</Typography>
								<Typography variant="caption" color="error.main" fontWeight={600}>0,00€</Typography>
							</Box>
							<LinearProgress variant="determinate" value={0} sx={{ height: 4, borderRadius: 2, bgcolor: 'divider' }} />
						</Card>

						{/* Beneficio */}
						<Card className="p-5 shadow-sm rounded-xl flex flex-col">
							<Typography variant="subtitle1" fontWeight={600} gutterBottom>Beneficio</Typography>
							<Typography variant="body2" color="text.secondary" gutterBottom>Año actual</Typography>
							<Typography variant="h4" fontWeight={700} sx={{ mt: 4, textAlign: 'right' }}>0,00€</Typography>
						</Card>

						{/* Crea tu primer banco CTA */}
						<Card className="p-5 shadow-sm rounded-xl flex flex-col items-center justify-center text-center">
							<Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
								<Typography variant="h6">🏦</Typography>
							</Box>
							<Typography variant="subtitle2" color="primary.main" fontWeight={600} sx={{ cursor: 'pointer' }}>
								Crea tu primer banco
							</Typography>
							<Typography variant="caption" color="text.secondary" sx={{ mt: 1, maxWidth: 200 }}>
								Conecta Holded con tus bancos para relacionar y tener un control máximo de tus movimientos.
							</Typography>
						</Card>

						{/* Resumen ventas y compras (Ancho completo) */}
						<Card className="p-5 shadow-sm rounded-xl md:col-span-2 flex flex-col justify-between" style={{ minHeight: 250 }}>
							<Box>
								<Typography variant="subtitle1" fontWeight={600} gutterBottom>Resumen ventas y compras</Typography>
								<Typography variant="body2" color="text.secondary">Últimos 12 meses</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
								<Box>
									<Typography variant="h4" fontWeight={700}>0,00€</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Febrero 2026</Typography>
								</Box>
								<Box sx={{ textAlign: 'right' }}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, mb: 1 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.light' }} />
											<Typography variant="body2" color="text.secondary">Ventas</Typography>
										</Box>
										<Typography variant="body2" fontWeight={500}>0,00€</Typography>
									</Box>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.light' }} />
											<Typography variant="body2" color="text.secondary">Compras</Typography>
										</Box>
										<Typography variant="body2" fontWeight={500}>0,00€</Typography>
									</Box>
								</Box>
							</Box>
							{/* Gráfico líneas estático con Recharts */}
							<Box sx={{ width: '100%', height: 100, mt: 4 }}>
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={salesAndPurchasesData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
										<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: theme.palette.text.secondary }} dy={10} />
										<RechartsTooltip cursor={{ stroke: theme.palette.divider, strokeWidth: 1 }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[2] }} />
										<Line type="monotone" dataKey="ventas" stroke={theme.palette.primary.light} strokeWidth={3} dot={{ r: 3, fill: theme.palette.primary.light }} activeDot={{ r: 5 }} />
										<Line type="monotone" dataKey="compras" stroke={theme.palette.error.light} strokeWidth={3} dot={{ r: 3, fill: theme.palette.error.light }} activeDot={{ r: 5 }} />
									</LineChart>
								</ResponsiveContainer>
							</Box>
						</Card>

						{/* Pagos / Cobros pendientes (Tarjeta Doble) */}
						<Card className="shadow-sm rounded-xl flex flex-col">
							<Box sx={{ p: 4, flex: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
									<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
									<Typography variant="subtitle2" fontWeight={600}>Pagos pendientes</Typography>
								</Box>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Mes actual</Typography>
								<Typography variant="h4" fontWeight={700} sx={{ textAlign: 'right' }}>0,00€</Typography>
							</Box>
							<Box sx={{ p: 4, flex: 1 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
									<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
									<Typography variant="subtitle2" fontWeight={600}>Cobros pendientes</Typography>
								</Box>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Mes actual</Typography>
								<Typography variant="h4" fontWeight={700} sx={{ textAlign: 'right' }}>0,00€</Typography>
							</Box>
						</Card>

						{/* Entradas y salidas de banco */}
						<Card className="p-5 shadow-sm rounded-xl flex flex-col">
							<Typography variant="subtitle1" fontWeight={600} gutterBottom>Entradas y salidas de banco</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Mes actual</Typography>

							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 'auto' }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
										<Typography variant="body2" color="text.secondary">Entradas</Typography>
									</Box>
									<Typography variant="body2" fontWeight={500}>0</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
										<Typography variant="body2" color="text.secondary">Salidas</Typography>
									</Box>
									<Typography variant="body2" fontWeight={500}>0</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
										<Typography variant="body2" color="text.secondary">Saldo</Typography>
									</Box>
									<Typography variant="body2" fontWeight={500}>0</Typography>
								</Box>
							</Box>
						</Card>

						{/* Resumen gastos (Ancho completo) */}
						<Card className="p-5 shadow-sm rounded-xl md:col-span-2 flex flex-col justify-between" style={{ minHeight: 250 }}>
							<Box>
								<Typography variant="subtitle1" fontWeight={600} gutterBottom>Resumen gastos</Typography>
								<Typography variant="body2" color="text.secondary">Últimos 12 meses</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
								<Box>
									<Typography variant="h4" fontWeight={700}>0,00€</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Febrero 2026</Typography>
								</Box>
								<Box sx={{ textAlign: 'right' }}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, mb: 1 }}>
										<Typography variant="body2" color="text.secondary">Presupuesto</Typography>
										<Typography variant="body2" fontWeight={500}>0,00€</Typography>
									</Box>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
										<Typography variant="body2" color="text.secondary">MoM</Typography>
										<Typography variant="body2" fontWeight={500}>-</Typography>
									</Box>
								</Box>
							</Box>
							{/* Gráfico barras estático con Recharts */}
							<Box sx={{ width: '100%', height: 100, mt: 4 }}>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={expensesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
										<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: theme.palette.text.secondary }} dy={10} />
										<RechartsTooltip cursor={{ fill: theme.palette.action.hover }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[2] }} />
										<Bar dataKey="value" fill={theme.palette.error.light} radius={[4, 4, 4, 4]} />
									</BarChart>
								</ResponsiveContainer>
							</Box>
						</Card>

						{/* Cuentas de gasto (Ancho doble) */}
						<Card className="p-5 shadow-sm rounded-xl md:col-span-2 flex flex-col">
							<Typography variant="subtitle1" fontWeight={600} gutterBottom>Cuentas de gasto</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Mes actual</Typography>

							<Box sx={{ display: 'flex', flexDirection: 'column' }}>
								{['Compras de mercaderías', 'Compras de materias primas', 'Compras de otros aprovisionamientos', 'Variación de existencias de mercaderías', 'Gastos en investigación y desarrollo del ejercicio', 'Arrendamientos y cánones', 'Reparaciones y conservación'].map((item, idx) => (
									<Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: idx !== 6 ? '1px solid' : 'none', borderColor: 'divider' }}>
										<Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{item}</Typography>
										<Typography variant="body2" color="primary.main" fontWeight={500} sx={{ ml: 2, textAlign: 'right' }}>0,00€ - 0,00€ (0%)</Typography>
									</Box>
								))}
							</Box>
						</Card>

						{/* Stock Crítico (Ancho doble) */}
						<Card className="p-5 shadow-sm rounded-xl md:col-span-2 flex flex-col">
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
								<Typography variant="subtitle1" fontWeight={600}>Stock Crítico</Typography>
								<Typography variant="caption" sx={{ bgcolor: 'error.main', color: 'error.contrastText', px: 1, py: 0.5, borderRadius: 1, fontWeight: 600 }}>5 Alertas</Typography>
							</Box>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Artículos por debajo del stock mínimo</Typography>

							<Box sx={{ display: 'flex', flexDirection: 'column' }}>
								{[
									{ name: 'Cable de red Cat6', min: 50, current: 12 },
									{ name: 'Router Wifi AC1200', min: 10, current: 2 },
									{ name: 'Switch 24 puertos', min: 5, current: 0 },
									{ name: 'Monitor 24 pulgadas', min: 15, current: 4 },
									{ name: 'Teclado mecánico', min: 20, current: 5 },
								].map((item, idx) => (
									<Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: idx !== 4 ? '1px solid' : 'none', borderColor: 'divider' }}>
										<Box sx={{ display: 'flex', flexDirection: 'column' }}>
											<Typography variant="body2" fontWeight={500}>{item.name}</Typography>
											<Typography variant="caption" color="text.secondary">Mínimo: {item.min}</Typography>
										</Box>
										<Typography variant="body2" color="error.main" fontWeight={600} sx={{ textAlign: 'right' }}>
											{item.current} disp.
										</Typography>
									</Box>
								))}
							</Box>
						</Card>

					</div>
				</Box>
			}
		/>
	);
}

export default DashboardView;
