import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const chartData = months.map((m) => ({
	month: m,
	ventas: 0,
	compras: 0
}));

export default function PartnerOverviewFinancialChart() {
	const theme = useTheme();

	return (
		<Paper
			variant="outlined"
			sx={{
				mb: 3,
				overflow: 'hidden',
				borderColor: 'divider'
			}}
		>
			<Box
				className="flex flex-col md:flex-row"
				sx={{ minHeight: 350 }}
			>
				<Box
					sx={{
						flex: 1,
						p: 3,
						borderRight: { xs: 0, md: 1 },
						borderBottom: { xs: 1, md: 0 },
						borderColor: '#E6EAF0 !important'
					}}
				>
					<Box
						className="flex items-center justify-between"
						sx={{ mb: 2.5 }}
					>
						<Box className="flex items-center gap-4">
							<Box className="flex items-center gap-1.5">
								<Box sx={{ width: 10, height: 10, bgcolor: '#4caf50' }} />
								<Typography
									variant="body2"
									fontWeight={600}
									sx={{ fontSize: '0.8rem' }}
								>
									Ventas
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ fontSize: '0.8rem' }}
								>
									0,00€
								</Typography>
							</Box>
							<Box className="flex items-center gap-1.5">
								<Box sx={{ width: 10, height: 10, bgcolor: '#f44336' }} />
								<Typography
									variant="body2"
									fontWeight={600}
									sx={{ fontSize: '0.8rem' }}
								>
									Compras
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ fontSize: '0.8rem' }}
								>
									0,00€
								</Typography>
							</Box>
						</Box>
						<Chip
							label="2026"
							size="small"
							variant="outlined"
							sx={{ fontSize: '0.75rem', fontWeight: 600 }}
						/>
					</Box>

					<ResponsiveContainer
						width="100%"
						height={260}
					>
						<BarChart
							data={chartData}
							barGap={2}
							barSize={14}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke={theme.palette.divider}
							/>
							<XAxis
								dataKey="month"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
								tickFormatter={(v: number) => `${v}€`}
							/>
							<Tooltip
								contentStyle={{
									background: theme.palette.background.paper,
									border: `1px solid ${theme.palette.divider}`,
									fontSize: 12
								}}
								formatter={(value: number) => [`${value.toFixed(2)}€`]}
							/>
							<Bar
								dataKey="ventas"
								fill="#4caf50"
								radius={[2, 2, 0, 0]}
								name="Ventas"
							/>
							<Bar
								dataKey="compras"
								fill="#f44336"
								radius={[2, 2, 0, 0]}
								name="Compras"
							/>
						</BarChart>
					</ResponsiveContainer>
				</Box>

				<Box
					sx={{
						width: { xs: '100%', md: 280 },
						flexShrink: 0,
						p: 2.5,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}
				>
					<Typography
						variant="overline"
						fontWeight={700}
						sx={{
							fontSize: '0.6rem',
							letterSpacing: '0.1em',
							color: 'text.secondary',
							mb: 1.5,
							display: 'block'
						}}
					>
						Resumen Financiero
					</Typography>
					<Stack spacing={1.5}>
						{[
							{ label: 'Total cobrado', value: '0,00€' },
							{ label: 'Total pagado', value: '0,00€' },
							{ label: 'Pendiente cobro', value: '0,00€' },
							{ label: 'Pendiente pago', value: '0,00€' },
							{ label: 'Promedio ventas', value: '0,00€' },
							{ label: 'Promedio compras', value: '0,00€' }
						].map((stat, idx) => (
							<Box
								key={idx}
								className="flex items-center justify-between"
							>
								<Typography
									variant="caption"
									color="text.secondary"
									fontWeight={500}
									sx={{ fontSize: '0.75rem' }}
								>
									{stat.label}
								</Typography>
								<Typography
									variant="body2"
									fontWeight={700}
									sx={{ fontSize: '0.85rem' }}
								>
									{stat.value}
								</Typography>
							</Box>
						))}
					</Stack>

					<Divider sx={{ my: 1.5 }} />

					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ fontSize: '0.75rem' }}
					>
						No hay presupuestos pendientes
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}
