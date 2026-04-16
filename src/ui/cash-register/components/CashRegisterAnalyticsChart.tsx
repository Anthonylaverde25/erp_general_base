import { useMemo } from 'react';
import { Box, Paper, Stack, Typography, useTheme, alpha } from '@mui/material';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	Legend,
	ReferenceLine
} from 'recharts';

interface CashRegisterAnalyticsChartProps {
	view: 'all' | 'ingresos' | 'egresos';
}

const rawData = [
	{ name: '08:00', ingresos: 500, egresos: 200 },
	{ name: '10:00', ingresos: 1200, egresos: 400 },
	{ name: '12:00', ingresos: 2100, egresos: 800 },
	{ name: '14:00', ingresos: 1800, egresos: 1200 },
	{ name: '16:00', ingresos: 2800, egresos: 1500 },
	{ name: '18:00', ingresos: 3500, egresos: 1800 },
	{ name: '20:00', ingresos: 4200, egresos: 2100 },
];

/**
 * Tooltip personalizado adaptado al estilo minimalista propuesto
 */
const CustomTooltip = ({ active, payload, label }: any) => {
	const theme = useTheme();
	if (active && payload && payload.length) {
		const ingresos = payload.find((p: any) => p.dataKey === 'ingresos')?.value || 0;
		const egresos = payload.find((p: any) => p.dataKey === 'egresos')?.value || 0;
		const saldo = payload.find((p: any) => p.dataKey === 'saldoNeto')?.value || 0;

		return (
			<Paper sx={{ 
				p: 2, 
				bgcolor: 'background.paper', 
				border: `1px solid ${theme.palette.divider}`, 
				boxShadow: theme.shadows[4],
				borderRadius: '4px'
			}}>
				<Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase' }}>
					{label}
				</Typography>
				<Stack spacing={1}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
						<Typography variant="caption" fontWeight={600} color="text.secondary">Ingresos:</Typography>
						<Typography variant="caption" fontWeight={700} color="primary.main">
							{ingresos.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
						<Typography variant="caption" fontWeight={600} color="text.secondary">Egresos:</Typography>
						<Typography variant="caption" fontWeight={700} color="error.main">
							{egresos.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: `1px dashed ${theme.palette.divider}` }}>
						<Typography variant="caption" fontWeight={800} color="text.primary">Liquidez:</Typography>
						<Typography variant="caption" fontWeight={900} color="info.main">
							{saldo.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
						</Typography>
					</Box>
				</Stack>
			</Paper>
		);
	}
	return null;
};

/**
 * Núcleo del Gráfico Analítico (Versión LineChart Minimalista)
 * Basado en la propuesta técnica del Señor Anthony.
 */
export default function CashRegisterAnalyticsChart({ view }: CashRegisterAnalyticsChartProps) {
	const theme = useTheme();

	// Calcular Saldo Neto Acumulado
	const chartData = useMemo(() => {
		let total = 0;
		return rawData.map(item => {
			total += (item.ingresos - item.egresos);
			return { ...item, saldoNeto: total };
		});
	}, []);

	return (
		<Box sx={{ width: '100%', height: 400, mt: 2 }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart 
					data={chartData} 
					margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
				>
					<CartesianGrid 
						strokeDasharray="3 3" 
						vertical={true} 
						stroke={theme.palette.divider} 
						opacity={0.8} 
					/>
					
					<ReferenceLine y={0} stroke={theme.palette.text.disabled} strokeDasharray="3 3" />

					<XAxis 
						dataKey="name" 
						axisLine={false}
						tickLine={false}
						tick={{ fill: theme.palette.text.secondary, fontSize: 11, fontWeight: 500 }}
						dy={10}
					/>
					
					<YAxis 
						width={60}
						axisLine={false}
						tickLine={false}
						tick={{ fill: theme.palette.text.secondary, fontSize: 11, fontWeight: 500 }}
						tickFormatter={(value) => `$${value}`}
					/>

					<RechartsTooltip 
						content={<CustomTooltip />}
						cursor={{ stroke: theme.palette.divider, strokeWidth: 1 }}
					/>
					
					<Legend 
						verticalAlign="bottom"
						align="center"
						height={36}
						iconType="circle"
						iconSize={8}
						wrapperStyle={{ paddingTop: '20px' }}
						formatter={(value) => (
							<span style={{ color: theme.palette.text.secondary, fontSize: '10px', fontWeight: 500, textTransform: 'capitalize', marginLeft: '4px' }}>
								{value}
							</span>
						)}
					/>

					{(view === 'all' || view === 'ingresos') && (
						<Line
							type="monotone"
							dataKey="ingresos"
							name="Ingresos"
							stroke={theme.palette.primary.main}
							strokeWidth={2}
							dot={{ fill: theme.palette.background.paper, strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, stroke: theme.palette.background.paper, strokeWidth: 2 }}
						/>
					)}

					{(view === 'all' || view === 'egresos') && (
						<Line
							type="monotone"
							dataKey="egresos"
							name="Egresos"
							stroke={theme.palette.error.main}
							strokeWidth={2}
							dot={{ fill: theme.palette.background.paper, strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, stroke: theme.palette.background.paper, strokeWidth: 2 }}
						/>
					)}

					{view === 'all' && (
						<Line
							type="monotone"
							dataKey="saldoNeto"
							name="Saldo Acumulado"
							stroke={theme.palette.info.main}
							strokeWidth={3}
							strokeDasharray="5 5"
							dot={{ fill: theme.palette.info.main, r: 3 }}
							activeDot={{ r: 8, stroke: theme.palette.background.paper, strokeWidth: 2 }}
						/>
					)}
					
					{/* RechartsDevtools se habilitará cuando la dependencia esté disponible */}
				</LineChart>
			</ResponsiveContainer>
		</Box>
	);
}
