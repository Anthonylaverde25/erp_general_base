import { Box, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis } from 'recharts';

const chartData = [
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

/**
 * Expenses summary bar chart with budget and month-over-month comparison.
 * Card frame styles are provided by .react-grid-item in GridWrapper.
 */
function ExpensesSummaryChart() {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* Header */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
				<Box>
					<Typography
						variant="subtitle1"
						fontWeight={600}
					>
						Resumen gastos
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Últimos 12 meses
					</Typography>
				</Box>
			</Box>

			{/* Summary row */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
				<Box>
					<Typography
						variant="h4"
						fontWeight={700}
					>
						0,00€
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 0.5 }}
					>
						Febrero 2026
					</Typography>
				</Box>
				<Box sx={{ textAlign: 'right' }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 0.5 }}>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Presupuesto
						</Typography>
						<Typography
							variant="caption"
							fontWeight={500}
						>
							0,00€
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							MoM
						</Typography>
						<Typography
							variant="caption"
							fontWeight={500}
						>
							—
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Chart */}
			<Box sx={{ flexGrow: 1, minHeight: 60, mt: 2 }}>
				<ResponsiveContainer
					width="100%"
					height="100%"
				>
					<BarChart
						data={chartData}
						margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
					>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
							dy={10}
						/>
						<RechartsTooltip
							cursor={{ fill: theme.palette.action.hover }}
							contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[2] }}
						/>
						<Bar
							dataKey="value"
							fill={theme.palette.error.light}
							radius={[4, 4, 4, 4]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
}

export default ExpensesSummaryChart;
