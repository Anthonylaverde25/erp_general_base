import { Box, Divider, Paper, Typography } from '@mui/material';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

interface ItemOverviewInventoryChartProps {
	item: ItemEntity;
	stockActual: number;
	unidadesVendidasMes: number;
	rotacionMensual: number;
	chartData: { month: string; unidades_vendidas: number; stock: number }[];
}

export default function ItemOverviewInventoryChart({
	item,
	stockActual,
	unidadesVendidasMes,
	rotacionMensual,
	chartData
}: ItemOverviewInventoryChartProps) {
	const theme = useTheme();

	return (
		<Paper
			variant="outlined"
			sx={{ mb: 3, overflow: 'hidden', borderColor: 'divider' }}
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
								<Box sx={{ width: 10, height: 10, bgcolor: '#1D4ED8' }} />
								<Typography
									variant="body2"
									fontWeight={600}
									sx={{ fontSize: '0.8rem' }}
								>
									Unidades vendidas
								</Typography>
							</Box>
							<Box className="flex items-center gap-1.5">
								<Box sx={{ width: 10, height: 10, bgcolor: '#004D1A' }} />
								<Typography
									variant="body2"
									fontWeight={600}
									sx={{ fontSize: '0.8rem' }}
								>
									Stock
								</Typography>
							</Box>
						</Box>
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
							/>
							<Tooltip
								contentStyle={{
									background: theme.palette.background.paper,
									border: `1px solid ${theme.palette.divider}`,
									fontSize: 12
								}}
							/>
							<Bar
								dataKey="unidades_vendidas"
								fill="#1D4ED8"
								radius={[2, 2, 0, 0]}
								name="Unidades vendidas"
							/>
							<Bar
								dataKey="stock"
								fill="#004D1A"
								radius={[2, 2, 0, 0]}
								name="Stock"
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
						Resumen de Inventario
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
						{[
							{ label: 'Stock actual', value: `${stockActual} uds` },
							{ label: 'Stock mínimo', value: '20 uds' },
							{ label: 'Último movimiento', value: '15 Feb 2026' },
							{ label: 'Unidades vendidas (mes)', value: `${unidadesVendidasMes} uds` },
							{ label: 'Rotación mensual', value: `${rotacionMensual}x` },
							{ label: 'SKU', value: item.sku },
							{ label: 'Categoría', value: item.category?.name || 'N/A' }
						].map((stat) => (
							<Box
								key={stat.label}
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
					</Box>
					<Divider sx={{ my: 1.5 }} />
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ fontSize: '0.75rem' }}
					>
						Sin alertas críticas de inventario
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}
