import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography, CircularProgress, IconButton, Divider } from '@mui/material';
import { Maximize2, Minimize2 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import axiosInstance from '@/lib/@axios';

interface CashFlowSummary {
  name: string;
  income: number;
  expense: number;
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

export default function ExpensesSummaryChart() {
  const [data, setData] = useState<CashFlowSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        const response = await axiosInstance.get('/dashboard/cash-flow');
        if (active) {
          setData(response.data.summary || []);
        }
      } catch (error) {
        console.error('Error fetching cash-flow summary:', error);
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
  }, []);

  const latestMonth = useMemo(() => {
    if (data.length === 0) return { name: '—', income: 0, expense: 0 };
    return data[data.length - 1];
  }, [data]);



  const getOption = () => {
    const months = data.map((item) => item.name);
    const income = data.map((item) => item.income);
    const expense = data.map((item) => item.expense);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        valueFormatter: (value: number) => formatCurrency(value)
      },
      legend: {
        data: ['Cobros (Ingresos)', 'Pagos (Gastos)'],
        top: 0,
        icon: 'circle',
        itemWidth: 10,
        textStyle: { fontSize: 11, color: '#6b7280' }
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
        top: 35,
        right: 15,
        bottom: 25,
        left: 55
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9e9e9e', fontSize: 10 }
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
      series: [
        {
          name: 'Cobros (Ingresos)',
          type: 'bar',
          barGap: '10%',
          barCategoryGap: '30%',
          itemStyle: { 
            color: '#10b981',
            borderRadius: [2, 2, 0, 0]
          },
          data: income
        },
        {
          name: 'Pagos (Gastos)',
          type: 'bar',
          itemStyle: { 
            color: '#ef4444',
            borderRadius: [2, 2, 0, 0]
          },
          data: expense
        }
      ]
    };
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        p: 1,
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={800} className="text-slate-800 dark:text-slate-200 leading-tight">
            Flujo de Caja (Cobros vs Pagos)
          </Typography>
          <Typography variant="caption" className="text-slate-400">
            Últimos 12 meses (Transacciones de pago)
          </Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={toggleFullscreen} 
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          sx={{ color: '#005483', p: 0.5 }}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </IconButton>
      </Box>

      {/* Summary row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1, mb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={900} className="text-slate-800 dark:text-slate-100">
            {formatCurrency(latestMonth.income)}
          </Typography>
          <Typography variant="caption" className="text-slate-400 block">
            Cobros de {latestMonth.name}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
              <Typography variant="caption" className="text-slate-500">
                Cobros
              </Typography>
            </Box>
            <Typography variant="caption" fontWeight={700} className="text-slate-700 dark:text-slate-300">
              {formatCurrency(latestMonth.income)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
              <Typography variant="caption" className="text-slate-500">
                Pagos
              </Typography>
            </Box>
            <Typography variant="caption" fontWeight={700} className="text-slate-700 dark:text-slate-300">
              {formatCurrency(latestMonth.expense)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ flexGrow: 1, minHeight: 180, mt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={24} sx={{ color: '#005483' }} />
          </Box>
        ) : (
          <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        )}
      </Box>
    </Box>
  );
}
