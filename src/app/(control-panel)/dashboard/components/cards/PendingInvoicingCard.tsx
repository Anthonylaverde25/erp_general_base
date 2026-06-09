import { CardContent, Typography, Box } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/@axios";
import ReactECharts from 'echarts-for-react';

export default function PendingInvoicingCard() {
    const [financialData, setFinancialData] = useState({ 
        count: 0, 
        pending_amount: 0,
        current_revenue: 25000 // Simulamos el ingreso actual facturado del mes
    });

    useEffect(() => {
        const fetchPendingInvoicing = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard/pending-invoicing');
                setFinancialData(prev => ({ 
                    ...prev,
                    count: data.count || 0, 
                    pending_amount: data.total_amount || 0
                }));
            } catch (error) {
                console.error("Error obteniendo facturación pendiente:", error);
            }
        }
        fetchPendingInvoicing();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0 
        }).format(value);
    };

    const totalPotential = financialData.current_revenue + financialData.pending_amount;
    const growthPercentage = financialData.current_revenue > 0 
        ? ((financialData.pending_amount / financialData.current_revenue) * 100).toFixed(1)
        : 0;

    // Configuración ECharts: Gráfico de Barras Apiladas (Stacked Bar Chart)
    const getChartOptions = () => {
        const meses = ['Feb', 'Mar', 'Abr', 'May', 'Jun (Actual)'];
        const ingresosConsolidados = [15000, 14000, 19000, 21000, financialData.current_revenue];
        const albaranesPendientes = [1200, 800, 1500, 3000, financialData.pending_amount || 5200]; 

        return {
            grid: { top: 35, right: 20, bottom: 25, left: 50 },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }, // Resalta la columna entera con un fondo sutil
                valueFormatter: (value) => formatCurrency(value)
            },
            legend: {
                data: ['Ingreso Consolidado', 'Albaranes Pendientes'],
                top: 0,
                icon: 'circle',
                itemWidth: 10,
                textStyle: { fontSize: 12, color: '#6b7280' }
            },
            xAxis: {
                type: 'category',
                data: meses,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#9e9e9e', fontSize: 12, margin: 12 },
                splitLine: { 
                    show: true, 
                    lineStyle: { type: 'dashed', color: '#e5e7eb' } 
                }
            },
            yAxis: {
                type: 'value',
                splitLine: { 
                    show: true,
                    lineStyle: { type: 'dashed', color: '#e5e7eb' } 
                },
                axisLabel: {
                    formatter: (value) => value >= 1000 ? `${value / 1000}k` : value,
                    color: '#9e9e9e',
                    fontSize: 12
                }
            },
            series: [
                {
                    name: 'Ingreso Consolidado',
                    type: 'bar',
                    stack: 'Total', // La clave para apilar
                    barWidth: '45%', // Barras con buen grosor
                    itemStyle: { 
                        color: '#1976d2', // Azul corporativo (lo seguro)
                        borderRadius: [0, 0, 2, 2] // Redondea solo la base
                    },
                    data: ingresosConsolidados
                },
                {
                    name: 'Albaranes Pendientes',
                    type: 'bar',
                    stack: 'Total', // Apila justo encima de la anterior
                    itemStyle: { 
                        color: '#ed6c02', // Naranja (la oportunidad)
                        borderRadius: [2, 2, 0, 0] // Redondea solo el techo
                    },
                    data: albaranesPendientes
                }
            ]
        };
    };

    return (
        <Box 
            sx={{ 
                borderRadius: 2, 
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.paper',
                overflow: 'hidden' 
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 2 }}>
                
                {/* Cabecera Financiera */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.50', color: 'primary.main', display: 'flex' }}>
                            <AccountBalanceWalletIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                Flujo de Ingresos
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ingresos vs Albaranes pendientes
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="warning.dark" sx={{ bgcolor: 'warning.light', px: 1.5, py: 0.5, borderRadius: 1 }}>
                        {financialData.count} albaranes
                    </Typography>
                </Box>

                {/* Gráfico de Barras Apiladas */}
                <Box sx={{ flexGrow: 1, minHeight: 220, width: '100%', mt: 1, mb: 2 }}>
                    <ReactECharts 
                        option={getChartOptions()} 
                        style={{ height: '100%', width: '100%' }} 
                        opts={{ renderer: 'svg' }} 
                    />
                </Box>

                {/* Insight Financiero Directo */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderTop: '1px solid', 
                        borderColor: 'divider', 
                        pt: 2
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            Ingreso Potencial Mes
                        </Typography>
                        <Typography variant="h6" fontWeight={800} color="text.primary">
                            {formatCurrency(totalPotential)}
                        </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                        ↑ Facturar estos albaranes sumaría un +{growthPercentage}% al mes actual.
                    </Typography>
                </Box>

            </CardContent>
        </Box>
    );
}