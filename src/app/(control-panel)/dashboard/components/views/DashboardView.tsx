import { useState, useCallback, useEffect } from 'react';
import axiosInstance from '@/lib/@axios';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Components
import DashboardToolbar from '../DashboardToolbar';
import DashGridItem from '../DashGridItem';

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

const STORAGE_KEY = 'dashboard_layouts_v7';

// ─── Page root ────────────────────────────────────────────────────────────────
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
  // ── Card container ──
  '& .react-grid-item': {
    userSelect: 'text',
    pointerEvents: 'auto'
  },
  '& .react-grid-item.react-draggable-dragging': {
    userSelect: 'none'
  },

  // ── Drag placeholder ──
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

  // ── Resize handle ──
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

  // ── Drag handle ──
  '& .drag-handle': {
    touchAction: 'none'
  }
}));

// ─── Layout definitions ──────────────────────────────────────────────────────
const initialLayouts = {
  lg: [
    { i: 'ventas', x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    { i: 'gastos', x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    { i: 'beneficio', x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    { i: 'incomplete_batches', x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    
    { i: 'resumen_ventas_compras', x: 0, y: 3, w: 6, h: 5, minW: 3, minH: 3 },
    { i: 'pagos_cobros_pendientes', x: 6, y: 3, w: 6, h: 5, minW: 3, minH: 3 },
    
    { i: 'pending_invoicing', x: 0, y: 8, w: 6, h: 5, minW: 3, minH: 3 },
    { i: 'resumen_gastos', x: 6, y: 8, w: 6, h: 5, minW: 3, minH: 3 },
    
    { i: 'banco', x: 0, y: 13, w: 3, h: 3, minW: 2, minH: 2 },
    { i: 'entradas_salidas_banco', x: 3, y: 13, w: 3, h: 3, minW: 2, minH: 2 },
    { i: 'cuentas_gasto', x: 6, y: 13, w: 3, h: 3, minW: 2, minH: 2 },
    { i: 'stock_critico', x: 9, y: 13, w: 3, h: 3, minW: 2, minH: 2 },
    
    { i: 'active_routes_card', x: 0, y: 16, w: 3, h: 3, minW: 2, minH: 2 },
    { i: 'pending_serialization', x: 3, y: 16, w: 3, h: 3, minW: 2, minH: 2 }
  ],
  md: [
    { i: 'ventas', x: 0, y: 0, w: 5, h: 3, minW: 2, minH: 2 },
    { i: 'gastos', x: 5, y: 0, w: 5, h: 3, minW: 2, minH: 2 },
    
    { i: 'beneficio', x: 0, y: 3, w: 5, h: 3, minW: 2, minH: 2 },
    { i: 'incomplete_batches', x: 5, y: 3, w: 5, h: 3, minW: 2, minH: 2 },
    
    { i: 'resumen_ventas_compras', x: 0, y: 6, w: 10, h: 5, minW: 4, minH: 3 },
    { i: 'pagos_cobros_pendientes', x: 0, y: 11, w: 10, h: 5, minW: 4, minH: 3 },
    
    { i: 'pending_invoicing', x: 0, y: 16, w: 10, h: 5, minW: 4, minH: 3 },
    { i: 'resumen_gastos', x: 0, y: 21, w: 10, h: 5, minW: 4, minH: 3 },
    
    { i: 'banco', x: 0, y: 26, w: 5, h: 3, minW: 2, minH: 2 },
    { i: 'entradas_salidas_banco', x: 5, y: 26, w: 5, h: 3, minW: 2, minH: 2 },
    
    { i: 'cuentas_gasto', x: 0, y: 29, w: 5, h: 3, minW: 2, minH: 2 },
    { i: 'stock_critico', x: 5, y: 29, w: 5, h: 3, minW: 2, minH: 2 },
    
    { i: 'active_routes_card', x: 0, y: 32, w: 5, h: 3, minW: 2, minH: 2 },
    { i: 'pending_serialization', x: 5, y: 32, w: 5, h: 3, minW: 2, minH: 2 }
  ]
};

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

// ─── Component ────────────────────────────────────────────────────────────────
function DashboardView() {
  const [layouts, setLayouts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialLayouts;
    } catch {
      return initialLayouts;
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  interface KpiData {
    total: number;
    target: number;
    percent: number;
    subtitle: string;
  }

  const [kpiData, setKpiData] = useState<{ sales: KpiData; expenses: KpiData } | null>(null);

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



  const handleLayoutChange = useCallback((_current: unknown, allLayouts: typeof initialLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
  }, []);

  const handleResetLayout = useCallback(() => {
    setLayouts(initialLayouts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLayouts));
  }, []);

  const handleToggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  return (
    <Root
      content={
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100%' }}>
          <DashboardToolbar
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
            onResetLayout={handleResetLayout}
          />

          <GridWrapper isEditing={isEditing}>
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={GRID_BREAKPOINTS}
              cols={GRID_COLS}
              rowHeight={GRID_ROW_HEIGHT}
              margin={GRID_MARGIN}
              onLayoutChange={handleLayoutChange}
              draggableHandle=".drag-handle"
              isDraggable={isEditing}
              isResizable={isEditing}
            >
              <div key="ventas">
                <DashGridItem isEditing={isEditing}>
                  <KpiCard
                    title="Ventas"
                    value={formatCurrency(kpiData?.sales.total ?? 0)}
                    subtitle={kpiData?.sales.subtitle ?? 'Año actual'}
                    progressPercent={kpiData?.sales.percent ?? 0}
                    targetValue={formatCurrency(kpiData?.sales.target ?? 10000)}
                    targetColor="success.main"
                  />
                </DashGridItem>
              </div>
              <div key="gastos">
                <DashGridItem isEditing={isEditing}>
                  <KpiCard
                    title="Gastos"
                    value={formatCurrency(kpiData?.expenses.total ?? 0)}
                    subtitle={kpiData?.expenses.subtitle ?? 'Año actual'}
                    progressPercent={kpiData?.expenses.percent ?? 0}
                    targetValue={formatCurrency(kpiData?.expenses.target ?? 5000)}
                    targetColor="error.main"
                  />
                </DashGridItem>
              </div>
              <div key="beneficio">
                <DashGridItem isEditing={isEditing}>
                  <KpiCard
                    title="Beneficio"
                    value={formatCurrency((kpiData?.sales.total ?? 0) - (kpiData?.expenses.total ?? 0))}
                    subtitle={kpiData?.sales.subtitle ?? 'Año actual'}
                  />
                </DashGridItem>
              </div>
              <div key="banco">
                <DashGridItem isEditing={isEditing}>
                  <BankCtaCard />
                </DashGridItem>
              </div>
              <div key="resumen_ventas_compras">
                <DashGridItem
                  isEditing={isEditing}
                  noPadding
                >
                  <SalesPurchasesChart />
                </DashGridItem>
              </div>
              <div key="pagos_cobros_pendientes">
                <DashGridItem
                  isEditing={isEditing}
                  noPadding
                >
                  <PendingBalancesChart />
                </DashGridItem>
              </div>
              <div key="entradas_salidas_banco">
                <DashGridItem isEditing={isEditing}>
                  <BankFlowCard />
                </DashGridItem>
              </div>
              <div key="resumen_gastos">
                <DashGridItem isEditing={isEditing}>
                  <ExpensesSummaryChart />
                </DashGridItem>
              </div>
              <div key="cuentas_gasto">
                <DashGridItem isEditing={isEditing}>
                  <ExpenseAccountsCard />
                </DashGridItem>
              </div>
              <div key="stock_critico">
                <DashGridItem isEditing={isEditing}>
                  <CriticalStockCard />
                </DashGridItem>
              </div>
              <div key="pending_invoicing">
                <DashGridItem isEditing={isEditing}>
                  <PendingInvoicingCard />
                </DashGridItem>
              </div>
              <div key="active_routes_card">
                <DashGridItem isEditing={isEditing}>
                  <ActiveRoutesCard />
                </DashGridItem>
              </div>
              <div key="incomplete_batches">
                <DashGridItem isEditing={isEditing}>
                  <IncompleteBatchesCard />
                </DashGridItem>
              </div>
              <div key="pending_serialization">
                <DashGridItem isEditing={isEditing}>
                  <PendingSerializationCard />
                </DashGridItem>
              </div>

            </ResponsiveGridLayout>
          </GridWrapper>
        </Box>
      }
    />
  );
}

export default DashboardView;