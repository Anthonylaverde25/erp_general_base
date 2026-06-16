import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactECharts from 'echarts-for-react';
import { useShowPartnerFinancialSummary } from '@/features/partners/hooks/useShowPartnerFinancialSummary';
import FuseLoading from '@fuse/core/FuseLoading';

interface PartnerOverviewFinancialChartProps {
	partnerId: number;
	partnerRole: string;
}

const formatCurrency = (val: number) => {
	return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
};

export default function PartnerOverviewFinancialChart({ partnerId, partnerRole }: PartnerOverviewFinancialChartProps) {
	const theme = useTheme();
	const { summary, isLoading } = useShowPartnerFinancialSummary(partnerId);

	if (isLoading) {
		return (
			<Paper variant="outlined" sx={{ p: 4, mb: 3, display: 'flex', justifyContent: 'center', borderColor: 'divider' }}>
				<FuseLoading />
			</Paper>
		);
	}

	const salesTotal = summary?.sales_total || 0;
	const purchasesTotal = summary?.purchases_total || 0;
	const collectedTotal = summary?.collected_total || 0;
	const paidTotal = summary?.paid_total || 0;
	const pendingCollection = summary?.pending_collection || 0;
	const pendingPayment = summary?.pending_payment || 0;

	// Determine visible series based on partner's role
	const isClient = partnerRole === 'client' || partnerRole === 'client_supplier';
	const isSupplier = partnerRole === 'supplier' || partnerRole === 'provider' || partnerRole === 'client_supplier';

	const series: any[] = [];
	const legendData: string[] = [];

	if (isClient) {
		legendData.push('Cobros (Ingresos)');
		series.push({
			name: 'Cobros (Ingresos)',
			type: 'line',
			smooth: true,
			showSymbol: false,
			itemStyle: { color: '#4caf50' },
			areaStyle: { opacity: 0.15 },
			data: summary?.monthly_payments.map((m) => m.collected) || []
		});
	}

	if (isSupplier) {
		legendData.push('Pagos (Gastos)');
		series.push({
			name: 'Pagos (Gastos)',
			type: 'line',
			smooth: true,
			showSymbol: false,
			itemStyle: { color: '#f44336' },
			areaStyle: { opacity: 0.15 },
			data: summary?.monthly_payments.map((m) => m.paid) || []
		});
	}

	const option = {
		grid: { top: 45, right: 20, bottom: 25, left: 60 },
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'line', lineStyle: { color: theme.palette.divider, width: 2 } },
			valueFormatter: (value: number) => formatCurrency(value)
		},
		legend: {
			data: legendData,
			top: 0,
			icon: 'circle',
			itemWidth: 10,
			textStyle: { color: theme.palette.text.secondary, fontSize: 11 }
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: summary?.monthly_payments.map((m) => m.month) || [],
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: theme.palette.text.secondary, fontSize: 11, margin: 12 },
			splitLine: { show: true, lineStyle: { type: 'dashed', color: theme.palette.divider } }
		},
		yAxis: {
			type: 'value',
			splitLine: { show: true, lineStyle: { type: 'dashed', color: theme.palette.divider } },
			axisLabel: {
				formatter: (value: number) => {
					if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
					if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
					return `${value}€`;
				},
				color: theme.palette.text.secondary,
				fontSize: 11
			}
		},
		series: series
	};

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
							{isClient && (
								<Box className="flex items-center gap-1.5">
									<Box sx={{ width: 10, height: 10, bgcolor: '#4caf50', borderRadius: '50%' }} />
									<Typography
										variant="body2"
										fontWeight={600}
										sx={{ fontSize: '0.8rem' }}
									>
										Total Cobrado:
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ fontSize: '0.8rem' }}
									>
										{formatCurrency(collectedTotal)}
									</Typography>
								</Box>
							)}
							{isSupplier && (
								<Box className="flex items-center gap-1.5">
									<Box sx={{ width: 10, height: 10, bgcolor: '#f44336', borderRadius: '50%' }} />
									<Typography
										variant="body2"
										fontWeight={600}
										sx={{ fontSize: '0.8rem' }}
									>
										Total Pagado:
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ fontSize: '0.8rem' }}
									>
										{formatCurrency(paidTotal)}
									</Typography>
								</Box>
							)}
						</Box>
						<Chip
							label={new Date().getFullYear().toString()}
							size="small"
							variant="outlined"
							sx={{ fontSize: '0.75rem', fontWeight: 600 }}
						/>
					</Box>

					<Box sx={{ height: 260, width: '100%' }}>
						<ReactECharts
							option={option}
							style={{ height: '100%', width: '100%' }}
							opts={{ renderer: 'svg' }}
						/>
					</Box>
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
							...(isClient ? [
								{ label: 'Facturado Ventas', value: formatCurrency(salesTotal) },
								{ label: 'Total cobrado', value: formatCurrency(collectedTotal) },
								{ label: 'Pendiente cobro', value: formatCurrency(pendingCollection), color: pendingCollection > 0 ? 'warning.main' : 'text.primary' }
							] : []),
							...(isSupplier ? [
								{ label: 'Facturado Compras', value: formatCurrency(purchasesTotal) },
								{ label: 'Total pagado', value: formatCurrency(paidTotal) },
								{ label: 'Pendiente pago', value: formatCurrency(pendingPayment), color: pendingPayment > 0 ? 'error.main' : 'text.primary' }
							] : [])
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
									sx={{ fontSize: '0.85rem', color: stat.color }}
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
						sx={{ fontSize: '0.75rem', textAlign: 'center' }}
					>
						{pendingCollection > 0 || pendingPayment > 0 
							? 'Hay saldos pendientes comerciales.' 
							: 'No hay saldos comerciales vencidos.'}
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
}
