
import {
    Box,
    Typography,
    Paper,
    Stack,
    Divider,
    Button,
    Chip,
    Avatar,
    useTheme
} from '@mui/material';
import {
    Add,
    TrendingUp,
    NoteAdd,
    Description,
    RequestQuote,
    PointOfSale,
    ShoppingCart
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { SectionTitle } from './PartnerProfileShared';

interface PartnerProfileOverviewProps {
    partner: PartnerEntity;
}

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const chartData = months.map((m) => ({
    month: m,
    ventas: 0,
    compras: 0
}));

export default function PartnerProfileOverview({ partner }: PartnerProfileOverviewProps) {
    const theme = useTheme();

    return (
        <Box sx={{ flex: 1, p: 3, overflowY: { xs: 'visible', md: 'auto' }, bgcolor: 'background.paper' }}>
            {/* Quick Actions */}
            <Box className="flex flex-wrap items-center justify-end gap-2 mb-4 mt-2">
                {[
                    { icon: <Description fontSize="small" />, label: 'Factura' },
                    { icon: <RequestQuote fontSize="small" />, label: 'Presupuesto' },
                    { icon: <NoteAdd fontSize="small" />, label: 'Nota' },
                    { icon: <PointOfSale fontSize="small" />, label: 'Venta' },
                    { icon: <ShoppingCart fontSize="small" />, label: 'Compra' },
                ].map((item) => (
                    <Button
                        key={item.label}
                        size="small"
                        startIcon={item.icon}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 0.5,
                            borderColor: 'divider',
                            bgcolor: 'transparent',
                            '&:hover': {
                                bgcolor: 'action.hover',
                                color: 'text.primary',
                                borderColor: 'divider'
                            }
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>

            {/* Ventas / Compras chart + Financial stats */}
            <Paper
                variant="outlined"
                sx={{
                    mb: 3,
                    overflow: 'hidden',
                    borderColor: 'divider',
                }}
            >
                <Box className="flex flex-col md:flex-row" sx={{ minHeight: 350 }}>
                    {/* Chart area */}
                    <Box sx={{ flex: 1, p: 3, borderRight: { xs: 0, md: 1 }, borderBottom: { xs: 1, md: 0 }, borderColor: 'divider' }}>
                        {/* Legend */}
                        <Box className="flex items-center justify-between" sx={{ mb: 2.5 }}>
                            <Box className="flex items-center gap-4">
                                <Box className="flex items-center gap-1.5">
                                    <Box sx={{ width: 10, height: 10, bgcolor: '#4caf50' }} />
                                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                                        Ventas
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                        0,00€
                                    </Typography>
                                </Box>
                                <Box className="flex items-center gap-1.5">
                                    <Box sx={{ width: 10, height: 10, bgcolor: '#f44336' }} />
                                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                                        Compras
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                        0,00€
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip
                                label="2026"
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                            />
                        </Box>

                        {/* Chart */}
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={chartData} barGap={2} barSize={14}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke={theme.palette.divider}
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                                    tickFormatter={(v: any) => `${v}€`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        fontSize: 12,
                                    }}
                                    formatter={(value: number) => [`${value.toFixed(2)}€`]}
                                />
                                <Bar dataKey="ventas" fill="#4caf50" radius={[2, 2, 0, 0]} name="Ventas" />
                                <Bar dataKey="compras" fill="#f44336" radius={[2, 2, 0, 0]} name="Compras" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>

                    {/* Financial stats */}
                    <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="overline" fontWeight={700} sx={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'text.secondary', mb: 1.5, display: 'block' }}>
                            Resumen Financiero
                        </Typography>
                        <Stack spacing={1.5}>
                            {[
                                { label: 'Total cobrado', value: '0,00€' },
                                { label: 'Total pagado', value: '0,00€' },
                                { label: 'Pendiente cobro', value: '0,00€' },
                                { label: 'Pendiente pago', value: '0,00€' },
                                { label: 'Promedio ventas', value: '0,00€' },
                                { label: 'Promedio compras', value: '0,00€' },
                            ].map((stat, idx) => (
                                <Box key={idx} className="flex items-center justify-between">
                                    <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            No hay presupuestos pendientes
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 3,
                    borderColor: 'divider',
                }}
            >
                <SectionTitle
                    action={
                        <Button
                            size="small"
                            startIcon={<Add sx={{ fontSize: 16 }} />}
                            sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                        >
                            Nueva actividad
                        </Button>
                    }
                >
                    Próximas actividades
                </SectionTitle>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    No hay actividades programadas
                </Typography>
            </Paper>

            {/* Bottom row: Oportunidades + Notas */}
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        borderColor: 'divider',
                    }}
                >
                    <SectionTitle>Oportunidades abiertas</SectionTitle>
                    <Box className="flex items-center gap-3">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected' }}>
                            <TrendingUp sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                                Embudo de ventas
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Maximiza tus oportunidades de venta a través de un CRM personalizado
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        borderColor: 'divider',
                    }}
                >
                    <SectionTitle>Notas</SectionTitle>
                    <Button
                        size="small"
                        startIcon={<NoteAdd sx={{ fontSize: 16 }} />}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', color: 'primary.main', p: 0, minWidth: 0 }}
                    >
                        Nueva nota
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}
