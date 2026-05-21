import { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ReactECharts from 'echarts-for-react';

interface CashRegisterAnalyticsChartProps {
	view: 'all' | 'ingresos' | 'egresos';
}

const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' });

const rawData = [
	{ name: '08:00', ingresos: 500, egresos: 200 },
	{ name: '10:00', ingresos: 1200, egresos: 400 },
	{ name: '12:00', ingresos: 2100, egresos: 800 },
	{ name: '14:00', ingresos: 1800, egresos: 1200 },
	{ name: '16:00', ingresos: 2800, egresos: 1500 },
	{ name: '18:00', ingresos: 3500, egresos: 1800 },
	{ name: '20:00', ingresos: 4200, egresos: 2100 }
];

export default function CashRegisterAnalyticsChart({ view }: CashRegisterAnalyticsChartProps) {
	const theme = useTheme();

	const chartData = useMemo(() => {
		let total = 0;
		return rawData.map((item) => {
			total += item.ingresos - item.egresos;
			return { ...item, saldoNeto: total };
		});
	}, []);

	const series = useMemo(() => {
		const common = {
			type: 'line' as const,
			smooth: true,
			symbol: 'none',
			lineStyle: { width: 2 },
			areaStyle: {},
			emphasis: { focus: 'series' as const },
			showSymbol: false
		};

		const dataIngresos = chartData.map((item) => item.ingresos);
		const dataEgresos = chartData.map((item) => item.egresos);
		const dataSaldo = chartData.map((item) => item.saldoNeto);

		if (view === 'ingresos') {
			return [
				{
					...common,
					name: 'Ingresos',
					data: dataIngresos,
					stack: 'total',
					itemStyle: { color: theme.palette.primary.main },
					lineStyle: { ...common.lineStyle, color: theme.palette.primary.main },
					areaStyle: { color: alpha(theme.palette.primary.main, 0.28) }
				}
			];
		}

		if (view === 'egresos') {
			return [
				{
					...common,
					name: 'Egresos',
					data: dataEgresos,
					stack: 'total',
					itemStyle: { color: theme.palette.error.main },
					lineStyle: { ...common.lineStyle, color: theme.palette.error.main },
					areaStyle: { color: alpha(theme.palette.error.main, 0.24) }
				}
			];
		}

		return [
			{
				...common,
				name: 'Ingresos',
				data: dataIngresos,
				stack: 'total',
				itemStyle: { color: theme.palette.primary.main },
				lineStyle: { ...common.lineStyle, color: theme.palette.primary.main },
				areaStyle: { color: alpha(theme.palette.primary.main, 0.28) }
			},
			{
				...common,
				name: 'Egresos',
				data: dataEgresos,
				stack: 'total',
				itemStyle: { color: theme.palette.error.main },
				lineStyle: { ...common.lineStyle, color: theme.palette.error.main },
				areaStyle: { color: alpha(theme.palette.error.main, 0.24) }
			},
			{
				...common,
				name: 'Saldo Acumulado',
				data: dataSaldo,
				stack: undefined,
				itemStyle: { color: theme.palette.info.main },
				lineStyle: { ...common.lineStyle, color: theme.palette.info.main, type: 'dashed' },
				areaStyle: undefined
			}
		];
	}, [chartData, theme.palette.error.main, theme.palette.info.main, theme.palette.primary.main, view]);

	const option = useMemo(
		() => ({
			animationDuration: 300,
			grid: {
				top: 16,
				left: 12,
				right: 12,
				bottom: 92,
				containLabel: true
			},
			legend: {
				show: true,
				bottom: 8,
				icon: 'circle',
				itemWidth: 8,
				itemHeight: 8,
				textStyle: {
					color: theme.palette.text.secondary,
					fontSize: 11
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'line' },
				backgroundColor: theme.palette.background.paper,
				borderColor: theme.palette.divider,
				borderWidth: 1,
				textStyle: { color: theme.palette.text.primary },
				formatter: (params: any[]) => {
					const axisLabel = params?.[0]?.axisValue ?? '';
					const dataIndex = params?.[0]?.dataIndex ?? 0;
					const getVal = (name: string) => Number(params.find((p) => p.seriesName === name)?.value ?? 0);
					const ingresos = getVal('Ingresos');
					const egresos = getVal('Egresos');
					const saldoNeto = chartData[dataIndex]?.saldoNeto ?? 0;
					const showIngresos = view === 'all' || view === 'ingresos';
					const showEgresos = view === 'all' || view === 'egresos';
					const showLiquidity = view === 'all';

					return `
						<div style="min-width: 200px;">
							<div style="font-size: 11px; font-weight: 800; margin-bottom: 8px;">${axisLabel}</div>
							${
								showIngresos
									? `<div style="display:flex; justify-content:space-between; gap:16px; font-size:11px;">
										<span>Ingresos:</span>
										<span style="font-weight:700; color:${theme.palette.primary.main};">${currencyFormatter.format(ingresos)}</span>
									</div>`
									: ''
							}
							${
								showEgresos
									? `<div style="display:flex; justify-content:space-between; gap:16px; font-size:11px; margin-top: 4px;">
										<span>Egresos:</span>
										<span style="font-weight:700; color:${theme.palette.error.main};">${currencyFormatter.format(egresos)}</span>
									</div>`
									: ''
							}
							${
								showLiquidity
									? `<div style="display:flex; justify-content:space-between; gap:16px; font-size:11px; margin-top: 8px; padding-top: 8px; border-top:1px dashed ${theme.palette.divider};">
										<span style="font-weight:800;">Liquidez:</span>
										<span style="font-weight:900; color:${theme.palette.info.main};">${currencyFormatter.format(saldoNeto)}</span>
									</div>`
									: ''
							}
						</div>
					`;
				}
			},
			dataZoom: [
				{
					type: 'inside',
					xAxisIndex: 0,
					filterMode: 'none'
				},
				{
					type: 'slider',
					xAxisIndex: 0,
					height: 20,
					bottom: 30,
					borderColor: theme.palette.divider,
					backgroundColor: alpha(theme.palette.text.secondary, 0.06),
					fillerColor: alpha(theme.palette.primary.main, 0.22),
					handleStyle: {
						color: theme.palette.primary.main
					},
					textStyle: {
						color: theme.palette.text.secondary,
						fontSize: 10
					}
				}
			],
			xAxis: {
				type: 'category',
				data: chartData.map((item) => item.name),
				axisTick: { show: false },
				axisLine: { lineStyle: { color: theme.palette.divider } },
				axisLabel: { color: theme.palette.text.secondary, fontSize: 11 }
			},
			yAxis: {
				type: 'value',
				axisTick: { show: false },
				axisLine: { show: false },
				splitLine: { lineStyle: { color: theme.palette.divider, type: 'dashed' } },
				axisLabel: {
					color: theme.palette.text.secondary,
					fontSize: 11,
					formatter: (value: number) => `$${value}`
				}
			},
			series
		}),
		[
			chartData,
			series,
			theme.palette.background.paper,
			theme.palette.divider,
			theme.palette.error.main,
			theme.palette.info.main,
			theme.palette.primary.main,
			theme.palette.text.primary,
			theme.palette.text.secondary
		]
	);

	return (
		<Box sx={{ width: '100%', height: 400, mt: 2 }}>
			<ReactECharts option={option} style={{ width: '100%', height: '100%' }} notMerge />
		</Box>
	);
}
