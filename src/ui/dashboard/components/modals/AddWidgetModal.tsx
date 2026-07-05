import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { useTenantModules } from '@/contexts/TenantModulesContext';

interface WidgetDef {
  type: string;
  name: string;
  description: string;
  category: 'Finanzas' | 'Ventas' | 'Compras' | 'Logística';
  defaultLayout: { w: number; h: number; minW: number; minH: number };
  requiredModules: string | string[] | null;
}

const AVAILABLE_WIDGETS: WidgetDef[] = [
  {
    type: 'ventas',
    name: 'KPI Ventas',
    description: 'Muestra el volumen de facturación del período actual contra el objetivo fijado.',
    category: 'Ventas',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: 'sales'
  },
  {
    type: 'gastos',
    name: 'KPI Gastos',
    description: 'Muestra el volumen de compras y gastos del período contra el límite de egresos.',
    category: 'Compras',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: 'purchases'
  },
  {
    type: 'beneficio',
    name: 'KPI Beneficio Neto',
    description: 'Calcula y presenta la rentabilidad neta comparando ventas y gastos devengados.',
    category: 'Finanzas',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: ['sales', 'purchases']
  },
  {
    type: 'banco',
    name: 'Saldo de Tesorería',
    description: 'Presenta el saldo disponible de las cuentas bancarias de la empresa.',
    category: 'Finanzas',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: null
  },
  {
    type: 'resumen_ventas_compras',
    name: 'Gráfico Ventas vs Compras',
    description: 'Gráfico comparativo del volumen de ventas y compras a lo largo del tiempo.',
    category: 'Finanzas',
    defaultLayout: { w: 6, h: 5, minW: 3, minH: 3 },
    requiredModules: ['sales', 'purchases']
  },
  {
    type: 'pagos_cobros_pendientes',
    name: 'Cobros y Pagos Pendientes',
    description: 'Gráfico detallado de facturas emitidas por cobrar y facturas de compras por pagar.',
    category: 'Finanzas',
    defaultLayout: { w: 6, h: 5, minW: 3, minH: 3 },
    requiredModules: ['sales', 'purchases']
  },
  {
    type: 'entradas_salidas_banco',
    name: 'Flujo de Caja',
    description: 'Muestra las variaciones monetarias reales (conciliadas) de cobros y pagos.',
    category: 'Finanzas',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: null
  },
  {
    type: 'resumen_gastos',
    name: 'Gráfico Resumen de Gastos',
    description: 'Gráfico circular de distribución de egresos por categorías.',
    category: 'Compras',
    defaultLayout: { w: 6, h: 5, minW: 3, minH: 3 },
    requiredModules: 'purchases'
  },
  {
    type: 'cuentas_gasto',
    name: 'Cuentas de Gastos Frecuentes',
    description: 'Resumen de las cuentas contables de egresos con más transacciones.',
    category: 'Compras',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: 'purchases'
  },
  {
    type: 'stock_critico',
    name: 'Alertas de Stock Crítico',
    description: 'Listado de artículos con inventario por debajo del mínimo configurado.',
    category: 'Logística',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: ['sales', 'purchases']
  },
  {
    type: 'pending_invoicing',
    name: 'Documentos Pendientes de Facturar',
    description: 'Resumen de presupuestos y albaranes que requieren ser convertidos a facturas.',
    category: 'Ventas',
    defaultLayout: { w: 6, h: 5, minW: 3, minH: 3 },
    requiredModules: 'sales'
  },
  {
    type: 'active_routes_card',
    name: 'Rutas de Entrega Activas',
    description: 'Control de rutas de despacho activas y estado de entregas en tiempo real.',
    category: 'Logística',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: 'sales'
  },
  {
    type: 'incomplete_batches',
    name: 'Lotes Incompletos',
    description: 'Trazabilidad de lotes de inventario que tienen carga parcial o pendientes de cierre.',
    category: 'Logística',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: ['sales', 'purchases']
  },
  {
    type: 'pending_serialization',
    name: 'Pendientes de Serializar',
    description: 'Muestra los artículos físicos recibidos que aún no tienen asignado sus números de serie.',
    category: 'Logística',
    defaultLayout: { w: 3, h: 3, minW: 2, minH: 2 },
    requiredModules: ['sales', 'purchases']
  }
];

interface AddWidgetModalProps {
  open: boolean;
  onClose: () => void;
  onSelectWidget: (widgetType: string, defaultLayout: { w: number; h: number; minW: number; minH: number }) => void;
  alreadyAddedTypes: string[];
}

export default function AddWidgetModal({ open, onClose, onSelectWidget, alreadyAddedTypes }: AddWidgetModalProps) {
  const { hasModule, hasAnyModule } = useTenantModules();

  const isWidgetVisible = (widget: WidgetDef): boolean => {
    const mod = widget.requiredModules;
    if (mod === null || mod === undefined) return true;
    if (Array.isArray(mod)) return hasAnyModule(mod);
    return hasModule(mod);
  };

  const filteredWidgets = AVAILABLE_WIDGETS.filter(isWidgetVisible);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>Biblioteca de Widgets</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {filteredWidgets.map((widget) => {
            const isAdded = alreadyAddedTypes.includes(widget.type);
            return (
              <Grid size={{ xs: 12, sm: 6 }} key={widget.type}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderColor: isAdded ? 'primary.light' : 'divider',
                    bgcolor: isAdded ? 'action.selected' : 'background.paper'
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {widget.name}
                      </Typography>
                      <Chip label={widget.category} size="small" variant="outlined" color="primary" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', mb: 1 }}>
                      {widget.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" display="block">
                      Tamaño sugerido: {widget.defaultLayout.w}x{widget.defaultLayout.h}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant={isAdded ? 'outlined' : 'contained'}
                      color={isAdded ? 'inherit' : 'primary'}
                      size="small"
                      disabled={isAdded}
                      onClick={() => onSelectWidget(widget.type, widget.defaultLayout)}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      {isAdded ? 'Ya Añadido' : 'Añadir al Tablero'}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
