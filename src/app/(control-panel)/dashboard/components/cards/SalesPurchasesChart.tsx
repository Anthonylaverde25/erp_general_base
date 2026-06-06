import { Box, Typography, useTheme } from '@mui/material';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';
import DragHandle from '../DragHandle';

const chartData = [
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
	{ name: 'Feb', ventas: 8500, compras: 5800 },
];

type SalesPurchasesChartProps = {
	isEditing: boolean;
};

/**
 * Line chart comparing sales vs purchases over the last 12 months.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function SalesPurchasesChart({ isEditing }: SalesPurchasesChartProps) {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Header */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
				<Box>
					<Typography variant="subtitle1" fontWeight={600}>
						Resumen ventas y compras
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Últimos 12 meses
					</Typography>
				</Box>
				{isEditing && <DragHandle />}
			</Box>

			{/* Summary row */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
				<Box>
					<Typography variant="h4" fontWeight={700}>
						0,00€
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
						Febrero 2026
					</Typography>
				</Box>
				<Box sx={{ textAlign: 'right' }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 0.5 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.light' }} />
							<Typography variant="caption" color="text.secondary">
								Ventas
							</Typography>
						</Box>
						<Typography variant="caption" fontWeight={500}>
							0,00€
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.light' }} />
							<Typography variant="caption" color="text.secondary">
								Compras
							</Typography>
						</Box>
						<Typography variant="caption" fontWeight={500}>
							0,00€
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Chart */}
			<Box sx={{ flexGrow: 1, minHeight: 60, mt: 2 }}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
							dy={10}
						/>
						<RechartsTooltip
							cursor={{ stroke: theme.palette.divider, strokeWidth: 1 }}
							contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[2] }}
						/>
						<Line type="monotone" dataKey="ventas" stroke={theme.palette.primary.light} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
						<Line type="monotone" dataKey="compras" stroke={theme.palette.error.light} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
}

export default SalesPurchasesChart;
