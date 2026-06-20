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

export default function PendingBalancesChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);
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
        const params = selectedYear ? { year: selectedYear } : {};
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

  const handleYearChange = (
    _event: React.MouseEvent<HTMLElement>,
    newYear: number | null
  ) => {
    if (newYear !== null) {
      setSelectedYear(newYear);
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
        right: 10,
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 8,
        textStyle: {
          fontSize: 10,
          color: '#9e9e9e'
        }
      },
      toolbox: {
        show: true,
        right: 150,
        top: -2,
        itemSize: 12,
        feature: {
          restore: { title: 'Restaurar' },
          saveAsImage: { title: 'Descargar' }
        }
      },
      grid: {
        top: 30,
        right: 5,
        bottom: 50,
        left: 5,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: chartType === 'bar',
        data: months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9e9e9e', fontSize: 10 },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#f3f4f6' }
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#f3f4f6' }
        },
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value;
          },
          color: '#9e9e9e',
          fontSize: 10
        }
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
          bottom: 10,
          height: 18,
          borderColor: 'transparent',
          backgroundColor: '#f9fafb',
          fillerColor: 'rgba(2, 132, 199, 0.12)',
          handleStyle: { color: '#0284c7', borderColor: '#fff', borderWidth: 1 },
          textStyle: { fontSize: 8 }
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
        p: 2,
        bgcolor: 'background.paper',
        color: 'text.primary',
        position: 'relative',
        '&:fullscreen': {
          p: 3,
          width: '100vw',
          height: '100vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
        }
      }}
    >
      {/* Header and Controls */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={800} className="text-slate-800 dark:text-slate-200 leading-tight">
            Análisis de Saldos Pendientes
          </Typography>
          <Typography variant="caption" className="text-slate-400">
            {selectedYear ? `Pendientes del año ${selectedYear}` : 'Pendientes últimos 12 meses'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" className="flex-wrap gap-y-1 justify-end">
          {/* Year selector */}
          <ToggleButtonGroup
            size="small"
            value={selectedYear}
            exclusive
            onChange={handleYearChange}
            aria-label="año seleccionado"
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
            <ToggleButton value={null}>Últ. 12m</ToggleButton>
            <ToggleButton value={currentYear}>{currentYear}</ToggleButton>
            <ToggleButton value={currentYear - 1}>{currentYear - 1}</ToggleButton>
            <ToggleButton value={currentYear - 2}>{currentYear - 2}</ToggleButton>
          </ToggleButtonGroup>

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

      {/* KPI Stats Bar */}
      <Box 
        className="bg-slate-50 dark:bg-slate-900/40 border border-solid border-slate-200 dark:border-slate-800"
        sx={{ 
          borderRadius: '4px', 
          p: 1.2, 
          mb: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" className="text-slate-400 font-semibold block uppercase tracking-wider" sx={{ fontSize: '8px' }}>
            Pendiente de Cobro
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} className="text-[#0284c7] font-mono" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(totals.salesPending)}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" className="text-slate-400 font-semibold block uppercase tracking-wider" sx={{ fontSize: '8px' }}>
            Pendiente de Pago
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} className="text-[#f97316] font-mono" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(totals.purchasesPending)}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider" sx={{ fontSize: '8px' }}>
              Saldo Pendiente Neto
            </Typography>
            {netIsPositive ? (
              <TrendingUp size={10} className="text-[#0284c7]" />
            ) : (
              <TrendingDown size={10} className="text-[#f97316]" />
            )}
          </Stack>
          <Typography 
            variant="subtitle2" 
            fontWeight={800} 
            sx={{ 
              color: netIsPositive ? '#0284c7' : '#f97316',
              fontVariantNumeric: 'tabular-nums'
            }} 
            className="font-mono"
          >
            {formatCurrency(totals.netPending)}
          </Typography>
        </Box>
      </Box>

      {/* Chart Canvas */}
      <Box sx={{ flexGrow: 1, minHeight: 180, display: 'flex', flexDirection: 'column' }}>
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
  );
}
