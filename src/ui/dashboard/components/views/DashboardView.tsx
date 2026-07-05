import { useState, useEffect, useMemo, useCallback } from 'react';
import axiosInstance from '@/lib/@axios';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Hooks & Types
import {
  useDashboards,
  useCreateDashboard,
  useUpdateDashboard,
  useDeleteDashboard,
  useAddWidget,
  useRemoveWidget,
  useUpdateLayouts,
} from '../../hooks/useDashboards';
import { DashboardWidget } from '../../types/dashboard.types';

// Components
import DashboardToolbar from '../DashboardToolbar';
import DashGridItem from '../DashGridItem';
import AddWidgetModal from '../modals/AddWidgetModal';

// Card components
import KpiCard from '../cards/KpiCard';
import BankCtaCard from '../cards/BankCtaCard';
import SalesPurchasesChart from '../cards/SalesPurchasesChart';
import PendingBalancesChart from '../cards/PendingBalancesChart';
import BankFlowCard from '../cards/BankFlowCard';
import ExpensesSummaryChart from '../cards/ExpensesSummaryChart';
import ExpenseAccountsCard from '../cards/ExpenseAccountsCard';
import CriticalStockCard from '../cards/CriticalStockCard';
import PendingInvoicingCard from '../cards/PendingInvoicingCard';
import ActiveRoutesCard from '../cards/ActiveRoutesCard';
import IncompleteBatchesCard from '../cards/IncompleteBatchesCard';
import PendingSerializationCard from '../cards/PendingSerializationCard';

// ─── react-grid-layout setup ─────────────────────────────────────────────────
const ResponsiveGridLayout = WidthProvider(Responsive);

const GRID_BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const GRID_COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const GRID_ROW_HEIGHT = 40;
const GRID_MARGIN: [number, number] = [16, 16];

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

// ─── Component Map ───────────────────────────────────────────────────────────
const WIDGET_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  ventas: ({ kpiData }) => (
    <KpiCard
      title="Ventas"
      value={formatCurrency(kpiData?.sales.total ?? 0)}
      subtitle={kpiData?.sales.subtitle ?? 'Año actual'}
      progressPercent={kpiData?.sales.percent ?? 0}
      targetValue={formatCurrency(kpiData?.sales.target ?? 10000)}
      targetColor="success.main"
    />
  ),
  gastos: ({ kpiData }) => (
    <KpiCard
      title="Gastos"
      value={formatCurrency(kpiData?.expenses.total ?? 0)}
      subtitle={kpiData?.expenses.subtitle ?? 'Año actual'}
      progressPercent={kpiData?.expenses.percent ?? 0}
      targetValue={formatCurrency(kpiData?.expenses.target ?? 5000)}
      targetColor="error.main"
    />
  ),
  beneficio: ({ kpiData }) => (
    <KpiCard
      title="Beneficio"
      value={formatCurrency((kpiData?.sales.total ?? 0) - (kpiData?.expenses.total ?? 0))}
      subtitle={kpiData?.sales.subtitle ?? 'Año actual'}
    />
  ),
  banco: () => <BankCtaCard />,
  resumen_ventas_compras: () => <SalesPurchasesChart />,
  pagos_cobros_pendientes: () => <PendingBalancesChart />,
  entradas_salidas_banco: () => <BankFlowCard />,
  resumen_gastos: () => <ExpensesSummaryChart />,
  cuentas_gasto: () => <ExpenseAccountsCard />,
  stock_critico: () => <CriticalStockCard />,
  pending_invoicing: () => <PendingInvoicingCard />,
  active_routes_card: () => <ActiveRoutesCard />,
  incomplete_batches: () => <IncompleteBatchesCard />,
  pending_serialization: () => <PendingSerializationCard />
};

// ─── Styled page wrapper ─────────────────────────────────────────────────────
const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.vars.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.vars.palette.divider
  },
  '& .FusePageSimple-content': {}
}));

// ─── Grid wrapper ─────────────────────────────────────────────────────────────
const GridWrapper = styled('div')<{ isEditing: boolean }>(({ theme }) => ({
  '& .react-grid-item': {
    userSelect: 'text',
    pointerEvents: 'auto'
  },
  '& .react-grid-item.react-draggable-dragging': {
    userSelect: 'none'
  },
  '& .react-grid-item.react-grid-placeholder': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: 8,
    opacity: 1,
    zIndex: 2,
    userSelect: 'none',
    padding: 0,
    boxShadow: 'none'
  },
  '& .react-grid-item > .react-resizable-handle': {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 2,
    right: 2,
    cursor: 'se-resize',
    zIndex: 50,
    backgroundImage: 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: 3,
      bottom: 3,
      width: 8,
      height: 8,
      borderRight: `2px solid ${theme.palette.text.disabled}`,
      borderBottom: `2px solid ${theme.palette.text.disabled}`
    },
    '&:hover::after': {
      borderColor: theme.palette.primary.main
    }
  },
  '& .drag-handle': {
    touchAction: 'none'
  }
}));

interface KpiData {
  total: number;
  target: number;
  percent: number;
  subtitle: string;
}

export default function DashboardView() {
  const { data: dashboards, isLoading: boardsLoading } = useDashboards();
  const createDashboard = useCreateDashboard();
  const updateDashboard = useUpdateDashboard();
  const deleteDashboard = useDeleteDashboard();
  const addWidget = useAddWidget();
  const removeWidget = useRemoveWidget();
  const updateLayouts = useUpdateLayouts();

  const [activeDashboardId, setActiveDashboardId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [kpiData, setKpiData] = useState<{ sales: KpiData; expenses: KpiData } | null>(null);

  // Initialize active dashboard
  useEffect(() => {
    if (dashboards && dashboards.length > 0) {
      const defaultBoard = dashboards.find((d) => d.is_default) || dashboards[0];
      setActiveDashboardId(defaultBoard.id);
    }
  }, [dashboards]);

  // Fetch KPI Data
  useEffect(() => {
    let active = true;
    const fetchKpis = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard/kpis');
        if (active) {
          setKpiData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard KPIs:', error);
      }
    };
    fetchKpis();
    return () => {
      active = false;
    };
  }, []);

  // Retrieve current active dashboard object
  const activeDashboard = useMemo(() => {
    return dashboards?.find((d) => d.id === activeDashboardId) || null;
  }, [dashboards, activeDashboardId]);

  // Map backend widgets to react-grid-layout items
  const filteredLayouts = useMemo(() => {
    if (!activeDashboard?.widgets) return { lg: [], md: [] };

    const items = activeDashboard.widgets.map((widget) => ({
      i: String(widget.id),
      x: widget.layout.x,
      y: widget.layout.y,
      w: widget.layout.w,
      h: widget.layout.h,
      minW: widget.layout.minW ?? 2,
      minH: widget.layout.minH ?? 2
    }));

    return {
      lg: items,
      md: items
    };
  }, [activeDashboard]);

  const handleLayoutChange = useCallback((currentLayout: any[], allLayouts: Record<string, any[]>) => {
    if (!isEditing || !activeDashboardId) return;

    // Use currentLayout which contains the positions of the active breakpoint
    const layoutsToSend = currentLayout.map((item) => ({
      id: Number(item.i),
      layout: {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      }
    }));

    updateLayouts.mutate({
      dashboardId: activeDashboardId,
      layouts: layoutsToSend
    });
  }, [activeDashboardId, isEditing, updateLayouts]);

  const handleCreateDashboard = async (name: string) => {
    createDashboard.mutate({ name }, {
      onSuccess: (newBoard) => {
        setActiveDashboardId(newBoard.id);
      }
    });
  };

  const handleUpdateDashboard = (id: number, payload: { name?: string; is_default?: boolean }) => {
    updateDashboard.mutate({ id, payload });
  };

  const handleDeleteDashboard = (id: number) => {
    deleteDashboard.mutate(id, {
      onSuccess: () => {
        if (dashboards && dashboards.length > 0) {
          const remaining = dashboards.filter((d) => d.id !== id);
          if (remaining.length > 0) {
            const defaultBoard = remaining.find((d) => d.is_default) || remaining[0];
            setActiveDashboardId(defaultBoard.id);
          } else {
            setActiveDashboardId(null);
          }
        }
      }
    });
  };

  const handleSelectWidget = (widgetType: string, defaultLayout: { w: number; h: number; minW: number; minH: number }) => {
    if (!activeDashboardId || !activeDashboard) return;

    // Calculate free Y coordinate at the bottom of the grid
    const maxY = activeDashboard.widgets.reduce((acc, w) => Math.max(acc, w.layout.y + w.layout.h), 0);

    const payload = {
      widget_type: widgetType,
      title: null,
      layout: {
        x: 0,
        y: maxY,
        w: defaultLayout.w,
        h: defaultLayout.h,
        minW: defaultLayout.minW,
        minH: defaultLayout.minH
      },
      settings: null
    };

    addWidget.mutate({
      dashboardId: activeDashboardId,
      payload
    }, {
      onSuccess: () => {
        setAddWidgetOpen(false);
      }
    });
  };

  const handleRemoveWidget = (widgetId: number) => {
    if (!activeDashboardId) return;

    if (confirm('¿Está seguro de que desea quitar este widget del tablero?')) {
      removeWidget.mutate({
        dashboardId: activeDashboardId,
        widgetId
      });
    }
  };

  const alreadyAddedTypes = useMemo(() => {
    return activeDashboard?.widgets.map((w) => w.widget_type) || [];
  }, [activeDashboard]);

  if (boardsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Root
      content={
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100%' }}>
          <DashboardToolbar
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing((prev) => !prev)}
            dashboards={dashboards || []}
            activeDashboardId={activeDashboardId}
            onSelectDashboard={setActiveDashboardId}
            onCreateDashboard={handleCreateDashboard}
            onDeleteDashboard={handleDeleteDashboard}
            onUpdateDashboard={handleUpdateDashboard}
            onOpenAddWidget={() => setAddWidgetOpen(true)}
          />

          {!activeDashboard || activeDashboard.widgets.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 12,
                px: 3,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                textAlign: 'center',
                mt: 2
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
                {!activeDashboard ? 'No tienes ningún tablero creado' : 'Este tablero está vacío'}
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 3, maxWidth: 400 }}>
                {!activeDashboard 
                  ? 'Crea un tablero de control arriba para comenzar a estructurar tus métricas.' 
                  : 'Edita el diseño de este tablero y añade widgets desde la biblioteca para visualizar tus KPIs.'}
              </Typography>
              {activeDashboard && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Editar y Añadir Widgets
                </Button>
              )}
            </Box>
          ) : (
            <GridWrapper isEditing={isEditing}>
              <ResponsiveGridLayout
                className="layout"
                layouts={filteredLayouts}
                breakpoints={GRID_BREAKPOINTS}
                cols={GRID_COLS}
                rowHeight={GRID_ROW_HEIGHT}
                margin={GRID_MARGIN}
                onLayoutChange={handleLayoutChange}
                draggableHandle=".drag-handle"
                isDraggable={isEditing}
                isResizable={isEditing}
              >
                {activeDashboard.widgets.map((widget) => {
                  const Component = WIDGET_COMPONENT_MAP[widget.widget_type];
                  if (!Component) return null;

                  const noPadding = ['resumen_ventas_compras', 'pagos_cobros_pendientes'].includes(widget.widget_type);

                  return (
                    <div key={String(widget.id)}>
                      <DashGridItem
                        isEditing={isEditing}
                        noPadding={noPadding}
                        onRemove={() => handleRemoveWidget(widget.id)}
                      >
                        <Component kpiData={kpiData} />
                      </DashGridItem>
                    </div>
                  );
                })}
              </ResponsiveGridLayout>
            </GridWrapper>
          )}

          {/* Catalog Dialog for Adding Widgets */}
          <AddWidgetModal
            open={addWidgetOpen}
            onClose={() => setAddWidgetOpen(false)}
            onSelectWidget={handleSelectWidget}
            alreadyAddedTypes={alreadyAddedTypes}
          />
        </Box>
      }
    />
  );
}