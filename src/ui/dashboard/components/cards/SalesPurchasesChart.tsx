import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AreaChart,
  BarChart2,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import axiosInstance from '@/lib/@axios';

interface MonthlySummary {
  name: string;
  ventas: number;
  compras: number;
  ventas_facturado?: number;
  compras_facturado?: number;
}

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const palette = {
  ink: '#0f172a',
  inkMuted: '#64748b',
  inkFaint: '#94a3b8',
  sales: '#1d4ed8',
  salesSoft: 'rgba(29,78,216,0.08)',
  purchases: '#b45309',
  purchasesSoft: 'rgba(180,83,9,0.08)',
  positive: '#15803d',
  negative: '#b91c1c',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  surface: '#ffffff',
  surfaceSunken: '#f8fafc',
};

const currencyFormatterPrecise = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatterPrecise.format(value);

const formatPercent = (value: number) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

// ---------------------------------------------------------------------------
// InlineStat Component
// ---------------------------------------------------------------------------
interface InlineStatProps {
  label: string;
  value: number;
  accentColor: string;
  delta?: number | null;
  emphasize?: boolean;
}

function InlineStat({ label, value, accentColor, delta, emphasize }: InlineStatProps) {
  const showDelta = delta !== null && delta !== undefined && Number.isFinite(delta);
  const deltaPositive = (delta ?? 0) > 0.05;
  const deltaNegative = (delta ?? 0) < -0.05;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.2 }}>
        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: accentColor, flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: '9.5px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: palette.inkFaint,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.8} alignItems="baseline">
        <Typography
          sx={{
            fontSize: emphasize ? '16px' : '14px',
            fontWeight: 700,
            fontFamily: '"IBM Plex Mono", "Roboto Mono", monospace',
            letterSpacing: '-0.01em',
            color: emphasize ? accentColor : palette.ink,
            lineHeight: 1.1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatCurrency(value)}
        </Typography>

        {showDelta && (
          <Stack direction="row" spacing={0.2} alignItems="center">
            {deltaPositive && <ArrowUpRight size={10} color={palette.positive} strokeWidth={2.5} />}
            {deltaNegative && <ArrowDownRight size={10} color={palette.negative} strokeWidth={2.5} />}
            {!deltaPositive && !deltaNegative && <Minus size={10} color={palette.inkFaint} strokeWidth={2.5} />}
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: '"IBM Plex Mono", "Roboto Mono", monospace',
                color: deltaPositive ? palette.positive : deltaNegative ? palette.negative : palette.inkFaint,
              }}
            >
              {formatPercent(delta as number)}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function SalesPurchasesChart() {
  const currentYear = new Date().getFullYear();
  const selectedYear = currentYear;
  const [data, setData] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [activeSeries, setActiveSeries] = useState<string[]>(['sales', 'purchases']);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error('Error entering fullscreen:', err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement && document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const params = { year: selectedYear };
        const response = await axiosInstance.get('/dashboard/sales-purchases', { params });
        if (active) {
          setData(response.data.summary || []);
        }
      } catch (err) {
        console.error('Error fetching sales-purchases summary:', err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [selectedYear]);

  const totals = useMemo(() => {
    let sales = 0;
    let salesInvoiced = 0;
    let purchases = 0;
    let purchasesInvoiced = 0;
    data.forEach((item) => {
      sales += item.ventas;
      salesInvoiced += item.ventas_facturado || 0;
      purchases += item.compras;
      purchasesInvoiced += item.compras_facturado || 0;
    });

    const lastTwo = data.slice(-2);
    let salesDelta: number | null = null;
    let purchasesDelta: number | null = null;
    if (lastTwo.length === 2) {
      const [prev, curr] = lastTwo;
      salesDelta = prev.ventas !== 0 ? ((curr.ventas - prev.ventas) / Math.abs(prev.ventas)) * 100 : null;
      purchasesDelta = prev.compras !== 0 ? ((curr.compras - prev.compras) / Math.abs(prev.compras)) * 100 : null;
    }

    return {
      sales,
      salesInvoiced,
      salesPending: Math.max(0, salesInvoiced - sales),
      purchases,
      purchasesInvoiced,
      purchasesPending: Math.max(0, purchasesInvoiced - purchases),
      balance: sales - purchases,
      salesDelta,
      purchasesDelta,
    };
  }, [data]);

  const handleChartTypeChange = (_e: React.MouseEvent<HTMLElement>, newType: 'area' | 'bar' | null) => {
    if (newType !== null) setChartType(newType);
  };

  const handleSeriesChange = (_e: React.MouseEvent<HTMLElement>, newSeries: string[]) => {
    if (newSeries.length > 0) setActiveSeries(newSeries);
  };

  const getOption = () => {
    const months = data.map((item) => item.name);
    const series: any[] = [];

    if (activeSeries.includes('sales')) {
      series.push({
        name: 'Ventas (Cobrado)',
        type: chartType === 'area' ? 'line' : 'bar',
        smooth: false,
        showSymbol: false,
        symbolSize: 5,
        lineStyle: { width: 2 },
        itemStyle: {
          color: palette.sales,
          borderRadius: chartType === 'bar' ? [2, 2, 0, 0] : 0,
        },
        emphasis: { focus: 'series' },
        areaStyle: chartType === 'area' ? {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(29,78,216,0.16)' },
              { offset: 1, color: 'rgba(29,78,216,0.01)' },
            ],
          },
        } : undefined,
        barGap: '20%',
        barMaxWidth: 22,
        data: data.map((item) => item.ventas),
      });
    }

    if (activeSeries.includes('purchases')) {
      series.push({
        name: 'Compras (Pagado)',
        type: chartType === 'area' ? 'line' : 'bar',
        smooth: false,
        showSymbol: false,
        symbolSize: 5,
        lineStyle: { width: 2 },
        itemStyle: {
          color: palette.purchases,
          borderRadius: chartType === 'bar' ? [2, 2, 0, 0] : 0,
        },
        emphasis: { focus: 'series' },
        areaStyle: chartType === 'area' ? {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(180,83,9,0.14)' },
              { offset: 1, color: 'rgba(180,83,9,0.01)' },
            ],
          },
        } : undefined,
        barMaxWidth: 22,
        data: data.map((item) => item.compras),
      });
    }

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0f172a',
        borderWidth: 0,
        padding: [8, 12],
        textStyle: { color: '#f8fafc', fontSize: 11.5, fontFamily: '"IBM Plex Mono", monospace' },
        axisPointer: { type: 'line', lineStyle: { color: palette.borderStrong, width: 1 } },
        valueFormatter: (value: number) => formatCurrency(value),
      },
      legend: {
        show: true,
        top: 0,
        right: 4,
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 3,
        itemGap: 18,
        textStyle: { fontSize: 11, color: palette.inkMuted, fontWeight: 500 },
      },
      grid: { top: 32, right: 4, bottom: 58, left: 4, containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: chartType === 'bar',
        data: months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: palette.inkFaint, fontSize: 10.5, fontWeight: 500 },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#f3f4f6' }
        },
      },
      yAxis: {
        type: 'value',
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f3f4f6' } },
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M €`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k €`;
            return `${value} €`;
          },
          color: palette.inkFaint,
          fontSize: 10.5,
        },
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        {
          type: 'slider',
          show: true,
          bottom: 12,
          height: 16,
          borderColor: 'transparent',
          backgroundColor: palette.surfaceSunken,
          fillerColor: 'rgba(29,78,216,0.10)',
          handleStyle: { color: palette.sales, borderColor: '#fff', borderWidth: 1.5 },
          textStyle: { fontSize: 9, color: palette.inkFaint },
          moveHandleStyle: { color: palette.borderStrong },
        }
      ],
      series,
    };
  };

  const balanceIsPositive = totals.balance >= 0;

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: palette.surface,
        color: palette.ink,
        border: '1px solid',
        borderColor: palette.border,
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: '"Inter", "Roboto", -apple-system, sans-serif',
        position: 'relative',
        gap: 1.5,
        '&:fullscreen': {
          width: '100vw',
          height: '100vh',
          overflowY: 'auto',
          bgcolor: palette.surface,
          borderRadius: 0,
          gap: 2.5,
          '& .card-header-section': { px: 3, pt: 2.5 },
          '& .card-content-section': { px: 3, pb: 3 },
        },
      }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <Box 
        className="card-header-section bg-slate-50 dark:bg-slate-900/60"
        sx={{ 
          px: 2, 
          py: 1.5, 
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={800} className="text-slate-800 dark:text-slate-200 leading-tight">
              Ventas y Compras
            </Typography>
            <Typography variant="caption" className="text-slate-400 block">
              Ejercicio fiscal {currentYear} · cobros y pagos efectivos
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" className="flex-wrap gap-y-1 justify-end">
            <ToggleButtonGroup
              size="small"
              value={activeSeries}
              onChange={handleSeriesChange}
              aria-label="visibilidad de series"
              sx={{ 
                height: 24,
                bgcolor: 'background.paper',
                '& .MuiToggleButton-root': {
                  borderRadius: '4px',
                  px: 0.8,
                  py: 0,
                  fontSize: '9px',
                  textTransform: 'none',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    color: '#ffffff',
                    bgcolor: palette.ink,
                    '&:hover': {
                      bgcolor: palette.ink
                    }
                  }
                }
              }}
            >
              <ToggleButton value="sales" title="Ventas Cobradas">Ventas</ToggleButton>
              <ToggleButton value="purchases" title="Compras Pagadas">Compras</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              size="small"
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              aria-label="tipo de grafico"
              sx={{ 
                height: 24,
                bgcolor: 'background.paper',
                '& .MuiToggleButton-root': {
                  borderRadius: '4px',
                  p: 0.4,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    color: '#ffffff',
                    bgcolor: palette.ink,
                    '&:hover': {
                      bgcolor: palette.ink
                    }
                  }
                }
              }}
            >
              <ToggleButton value="area" title="Área / Línea">
                <AreaChart size={11} />
              </ToggleButton>
              <ToggleButton value="bar" title="Barras">
                <BarChart2 size={11} />
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: 'center' }} />

            <Tooltip title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
              <IconButton
                size="small"
                onClick={toggleFullscreen}
                sx={{
                  color: palette.inkMuted,
                  p: 0.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '4px',
                  '&:hover': { bgcolor: 'background.paper', color: palette.ink },
                }}
              >
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* ----------------------------------------------------------------- */}
      {/* Content                                                           */}
      {/* ----------------------------------------------------------------- */}
      <Box
        className="card-content-section"
        sx={{ px: 2.5, pb: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}
      >
        {error ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: palette.inkFaint,
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: palette.ink }}>
              No se pudieron cargar los datos
            </Typography>
            <Typography sx={{ fontSize: '11.5px' }}>
              Revisa la conexión e inténtalo de nuevo.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 4 }}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: palette.border, display: { xs: 'none', sm: 'block' } }}
                />
              }
              sx={{ mb: 2 }}
            >
              <InlineStat
                label="Ventas Cobradas"
                value={totals.sales}
                accentColor={palette.sales}
                delta={totals.salesDelta}
              />
              <InlineStat
                label="Compras Pagadas"
                value={totals.purchases}
                accentColor={palette.purchases}
                delta={totals.purchasesDelta}
              />
              <InlineStat
                label="Balance Neto de Caja"
                value={totals.balance}
                accentColor={balanceIsPositive ? palette.positive : palette.negative}
                emphasize
              />
            </Stack>

            <Divider sx={{ borderColor: palette.border, mb: 2 }} />

            <Box sx={{ flexGrow: 1, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                  <CircularProgress size={22} thickness={4} sx={{ color: palette.sales }} />
                </Box>
              ) : data.length === 0 ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: palette.inkFaint,
                    fontSize: '12.5px',
                  }}
                >
                  Sin movimientos registrados en {currentYear}.
                </Box>
              ) : (
                <ReactECharts
                  option={getOption()}
                  style={{ height: '100%', width: '100%', flexGrow: 1 }}
                  opts={{ renderer: 'svg' }}
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}