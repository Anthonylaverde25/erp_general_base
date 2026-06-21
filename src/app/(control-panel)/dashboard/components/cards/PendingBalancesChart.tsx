import { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  ToggleButtonGroup, 
  ToggleButton, 
  Stack, 
  Divider,
  IconButton
} from '@mui/material';
import { 
  AreaChart, 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Maximize2,
  Minimize2
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

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const palette = {
  ink: '#0f172a',
  inkMuted: '#64748b',
  inkFaint: '#94a3b8',
  salesPending: '#0284c7',
  purchasesPending: '#f97316',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  surface: '#ffffff',
  surfaceSunken: '#f8fafc',
};

interface InlineStatProps {
  label: string;
  value: number;
  accentColor: string;
  trendIcon?: React.ReactNode;
  emphasize?: boolean;
}

function InlineStat({ label, value, accentColor, trendIcon, emphasize }: InlineStatProps) {
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

        {trendIcon && (
          <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
            {trendIcon}
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default function PendingBalancesChart() {
  const currentYear = new Date().getFullYear();
  const selectedYear = currentYear;
  const [data, setData] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Chart UI state
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [activeSeries, setActiveSeries] = useState<string[]>(['sales_pending', 'purchases_pending']);

  // Fullscreen support
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement && document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = { year: selectedYear };
        const response = await axiosInstance.get('/dashboard/sales-purchases', { params });
        if (active) {
          setData(response.data.summary || []);
        }
      } catch (error) {
        console.error('Error fetching sales-purchases summary for pending:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [selectedYear]);

  // Calculate totals
  const totals = useMemo(() => {
    let salesPending = 0;
    let purchasesPending = 0;

    data.forEach((item) => {
      const vFact = item.ventas_facturado || 0;
      const cFact = item.compras_facturado || 0;
      salesPending += Math.max(0, vFact - item.ventas);
      purchasesPending += Math.max(0, cFact - item.compras);
    });

    return {
      salesPending,
      purchasesPending,
      netPending: salesPending - purchasesPending
    };
  }, [data]);

  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: 'area' | 'bar' | null
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleSeriesChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSeries: string[]
  ) => {
    if (newSeries.length > 0) {
      setActiveSeries(newSeries);
    }
  };

  const getOption = () => {
    const months = data.map((item) => item.name);
    const series = [];

    if (activeSeries.includes('sales_pending')) {
      series.push({
        name: 'Pendiente Cobro',
        type: chartType === 'area' ? 'line' : 'bar',
        smooth: true,
        showSymbol: false,
        itemStyle: { color: '#0284c7' },
        areaStyle: chartType === 'area' ? {
          opacity: 0.15,
          color: '#0284c7'
        } : undefined,
        data: data.map((item) => Math.max(0, (item.ventas_facturado || 0) - item.ventas))
      });
    }

    if (activeSeries.includes('purchases_pending')) {
      series.push({
        name: 'Pendiente Pago',
        type: chartType === 'area' ? 'line' : 'bar',
        smooth: true,
        showSymbol: false,
        itemStyle: { color: '#f97316' },
        areaStyle: chartType === 'area' ? {
          opacity: 0.15,
          color: '#f97316'
        } : undefined,
        data: data.map((item) => Math.max(0, (item.compras_facturado || 0) - item.compras))
      });
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#e5e7eb',
            width: 1
          }
        },
        valueFormatter: (value: number) => formatCurrency(value)
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
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#f3f4f6' }
        },
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
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: true,
          bottom: 12,
          height: 16,
          borderColor: 'transparent',
          backgroundColor: palette.surfaceSunken,
          fillerColor: 'rgba(2, 132, 199, 0.10)',
          handleStyle: { color: '#0284c7', borderColor: '#fff', borderWidth: 1.5 },
          textStyle: { fontSize: 9, color: palette.inkFaint },
          moveHandleStyle: { color: palette.borderStrong },
        }
      ],
      series
    };
  };

  const netIsPositive = totals.netPending >= 0;

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
        }
      }}
    >
      {/* Card Header Section */}
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
              Análisis de Saldos Pendientes
            </Typography>
            <Typography variant="caption" className="text-slate-400">
              Pendientes del año {currentYear}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" className="flex-wrap gap-y-1 justify-end">
            {/* Series selector */}
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
                    bgcolor: '#0284c7',
                    '&:hover': {
                      bgcolor: '#0270a8'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="sales_pending" title="Pendiente de Cobro">Cobros</ToggleButton>
              <ToggleButton value="purchases_pending" title="Pendiente de Pago">Pagos</ToggleButton>
            </ToggleButtonGroup>

            {/* Chart Type selector */}
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
                    bgcolor: '#0284c7',
                    '&:hover': {
                      bgcolor: '#0270a8'
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

            <IconButton 
              size="small" 
              onClick={toggleFullscreen} 
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              sx={{ color: '#0284c7', p: 0.5 }}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Card Content Section */}
      <Box 
        className="card-content-section"
        sx={{ 
          px: 2.5, 
          pb: 2.5,
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          minHeight: 0
        }}
      >
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
            label="Pendiente de Cobro"
            value={totals.salesPending}
            accentColor={palette.salesPending}
          />
          <InlineStat
            label="Pendiente de Pago"
            value={totals.purchasesPending}
            accentColor={palette.purchasesPending}
          />
          <InlineStat
            label="Saldo Pendiente Neto"
            value={totals.netPending}
            accentColor={netIsPositive ? palette.salesPending : palette.purchasesPending}
            trendIcon={
              netIsPositive ? (
                <TrendingUp size={10} color={palette.salesPending} />
              ) : (
                <TrendingDown size={10} color={palette.purchasesPending} />
              )
            }
            emphasize
          />
        </Stack>

        <Divider sx={{ borderColor: palette.border, mb: 2 }} />

        {/* Chart Canvas */}
        <Box sx={{ flexGrow: 1, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
              <CircularProgress size={24} sx={{ color: '#0284c7' }} />
            </Box>
          ) : (
            <ReactECharts
              option={getOption()}
              style={{ height: '100%', width: '100%', flexGrow: 1 }}
              opts={{ renderer: 'svg' }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

