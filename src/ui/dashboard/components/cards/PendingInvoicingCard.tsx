import { CardContent, Typography, Box, Divider, IconButton } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useEffect, useState, useMemo, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import axiosInstance from "@/lib/@axios";
import ReactECharts from 'echarts-for-react';

// Tipados estrictos
interface PendingInvoicing {
    count: number;
    pendingAmount: number;
}

interface MonthlyPayment {
    year: number;
    month: number;
    total_amount: number;
}

export default function PendingInvoicingCard() {
    const [pendingInvoicing, setPendingInvoicing] = useState<PendingInvoicing>({ 
        count: 0, 
        pendingAmount: 0 
    });

    const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment[]>([]);
    
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
    
    const [pendingAmount, setPendingAmount] = useState<{pending_amount: number}>({
        pending_amount: 0
    });

    useEffect(() => {
        const fetchPendingInvoicing = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard/pending-invoicing');
                setPendingInvoicing({ 
                    count: data.count || 0, 
                    pendingAmount: Number(data.total_amount) || 0
                });
            } catch (error) {
                console.error("Error fetching pending invoicing:", error);
            }
        }
        fetchPendingInvoicing();
    }, []);

    useEffect(() => {
        const fetchMonthlyPayments = async () => {
            try {
                const { data: { payment_monthly } } = await axiosInstance.get('/dashboard/monthly-payments');
                setMonthlyPayments(payment_monthly);
            } catch (error) {
                console.error("Error fetching monthly payments:", error);
            }
        }
        fetchMonthlyPayments();
    }, []);

    useEffect(() => {
        const fetchPendingAmount = async () => {
            try {
                const { data: { pending_amount } } = await axiosInstance.get('/dashboard/pending-amount');
                setPendingAmount({ pending_amount: Number(pending_amount) || 0 });
            } catch (error) {
                console.error("Error fetching pending amount:", error);
            }
        }
        fetchPendingAmount();
    }, []);

    const chartData = useMemo(() => {
        if (!monthlyPayments.length) {
            return { labels: [], consolidated: [], pendingInvoices: [], pendingDeliveryNotes: [], currentRevenue: 0 };
        }

        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        const sortedPayments = [...monthlyPayments].sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });

        const labels: string[] = [];
        const consolidated: number[] = [];
        const pendingInvoices: number[] = [];
        const pendingDeliveryNotes: number[] = [];
        let currentRevenue = 0;

        const mockHistoricalDeliveryNotes = [1200.50, 800.00, 1500.25, 3000.00, 2100.80, 1700.00];
        const mockHistoricalDebt = [500.00, 1100.00, 900.00, 1800.00, 1300.00, 2000.00];

        sortedPayments.forEach((payment, index) => {
            const isLastItem = index === sortedPayments.length - 1;
            const monthName = monthNames[payment.month - 1];
            
            labels.push(isLastItem ? `${monthName} ${payment.year} (Actual)` : `${monthName} ${payment.year}`);
            
            const amount = Number(payment.total_amount);
            consolidated.push(amount);
            
            if (isLastItem) {
                pendingDeliveryNotes.push(pendingInvoicing.pendingAmount);
                pendingInvoices.push(pendingAmount.pending_amount);
                currentRevenue = amount;
            } else {
                pendingDeliveryNotes.push(mockHistoricalDeliveryNotes[index % mockHistoricalDeliveryNotes.length]); 
                pendingInvoices.push(mockHistoricalDebt[index % mockHistoricalDebt.length]);
            }
        });

        return { labels, consolidated, pendingInvoices, pendingDeliveryNotes, currentRevenue };
    }, [monthlyPayments, pendingInvoicing.pendingAmount, pendingAmount.pending_amount]);

    // CORRECCIÓN CRÍTICA: Se exigen 2 decimales para respetar la integridad del valor real (ej: 412725.06)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', { 
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }).format(value);
    };

    const getChartOptions = () => {
        return {
            grid: { top: 45, right: 20, bottom: 65, left: 55 }, 
            dataZoom: [
                { type: 'inside', start: 0, end: 100 },
                {
                    type: 'slider',
                    show: true,
                    bottom: 10,
                    height: 24,
                    borderColor: 'transparent',
                    backgroundColor: '#f9fafb',
                    fillerColor: 'rgba(25, 118, 210, 0.15)',
                    handleStyle: { color: '#1976d2', borderColor: '#fff', borderWidth: 2 }
                }
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'line', lineStyle: { color: '#e5e7eb', width: 2 } },
                valueFormatter: (value: number) => value > 0 ? formatCurrency(value) : '' 
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
            legend: {
                data: ['Pagos Consolidados', 'Cuentas por Cobrar', 'Albaranes Pendientes'], 
                top: 0,
                icon: 'circle',
                itemWidth: 10,
                textStyle: { fontSize: 12, color: '#6b7280' }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: chartData.labels,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#9e9e9e', fontSize: 12, margin: 12 },
                splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f3f4f6' } }
            },
            yAxis: {
                type: 'value',
                splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f3f4f6' } },
                axisLabel: {
                    // CORRECCIÓN: Evita decimales infinitos al reducir la escala a 'k' (miles) o 'M' (millones)
                    formatter: (value: number) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                        return value;
                    },
                    color: '#9e9e9e',
                    fontSize: 12
                }
            },
            series: [
                {
                    name: 'Pagos Consolidados',
                    type: 'line',
                    smooth: true,
                    stack: 'Total',
                    showSymbol: false,
                    itemStyle: { color: '#1976d2' }, 
                    areaStyle: { opacity: 0.15 },
                    data: chartData.consolidated
                },
                {
                    name: 'Cuentas por Cobrar', 
                    type: 'line',
                    smooth: true,
                    stack: 'Total',
                    showSymbol: false,
                    itemStyle: { color: '#9c27b0' }, 
                    areaStyle: { opacity: 0.15 },
                    data: chartData.pendingInvoices
                },
                {
                    name: 'Albaranes Pendientes',
                    type: 'line',
                    smooth: true,
                    stack: 'Total',
                    showSymbol: false,
                    itemStyle: { color: '#ed6c02' }, 
                    areaStyle: { opacity: 0.15 },
                    data: chartData.pendingDeliveryNotes
                }
            ]
        };
    };

    return (
        <Box 
            ref={containerRef}
            sx={{ 
                borderRadius: 2, 
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.paper',
                color: 'text.primary',
                position: 'relative',
                overflow: 'hidden',
                '&:fullscreen': {
                    p: 2,
                    width: '100vw',
                    height: '100vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 2 }}>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.50', color: 'primary.main', display: 'flex' }}>
                            <AccountBalanceWalletIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                Análisis de Flujo y Deuda
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Consolidado vs Cuentas por Cobrar
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton 
                        size="small" 
                        onClick={toggleFullscreen} 
                        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                        sx={{ color: 'primary.main', p: 0.5 }}
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1, minHeight: 280, width: '100%', mt: 1, mb: 2 }}>
                    <ReactECharts 
                        option={getChartOptions()} 
                        style={{ height: '100%', width: '100%' }} 
                        opts={{ renderer: 'svg' }} 
                    />
                </Box>

                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1}>
                        Resumen del Mes Actual
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Ingreso Real</Typography>
                            <Typography variant="body1" fontWeight={700} color="primary.main">
                                {formatCurrency(chartData.currentRevenue)}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Deuda (Por cobrar)</Typography>
                            <Typography variant="body1" fontWeight={700} color="secondary.main">
                                {formatCurrency(pendingAmount.pending_amount)}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Oportunidad (Albaranes)</Typography>
                            <Typography variant="body1" fontWeight={700} color="warning.main">
                                {formatCurrency(pendingInvoicing.pendingAmount)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

            </CardContent>
        </Box>
    );
}