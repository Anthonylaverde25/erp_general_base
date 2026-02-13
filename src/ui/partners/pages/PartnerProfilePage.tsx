import { useParams, useNavigate } from 'react-router';
import { useShowPartner } from '@/features/partners/hooks/useShowPartner';
import useIndexPaymentMethods from '@/features/payment_methods/hooks/useIndexPaymentMethods';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useState } from 'react';
import {
    Box,
    Typography,
    Chip,
    Divider,
    Paper,
    Stack,
    Tab,
    Tabs,
    Button,
    IconButton,
    Avatar,
    Link as MuiLink,
    alpha,
    useTheme
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    WhatsApp,
    Mail,
    Phone,
    LocationOn,
    Business,
    Person,
    AccountBalance,
    Add,
    CheckCircle,
    Cancel,
    TrendingUp,
    TrendingDown,
    Receipt,
    ShoppingCart,
    MoreVert,
    NoteAdd,
    ContentCopy
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { PartnerTax } from '@/domain/entities/partners/DTOs/PartnerDTOs';

/* ── Constants ───────────────────────────────────────────────────────── */

const roleLabels: Record<string, string> = {
    client: 'Cliente',
    supplier: 'Proveedor',
    client_supplier: 'Cliente / Proveedor',
    prospect: 'Prospecto'
};

const typeLabels: Record<string, string> = {
    company: 'Empresa',
    person: 'Persona',
    public_organism: 'Org. Público',
    prospect: 'Prospecto'
};

const typeIcons: Record<string, React.ReactNode> = {
    company: <Business sx={{ fontSize: 28 }} />,
    person: <Person sx={{ fontSize: 28 }} />,
    public_organism: <AccountBalance sx={{ fontSize: 28 }} />,
    prospect: <Person sx={{ fontSize: 28 }} />
};

/* ── Mock chart data (ventas/compras por mes) ───────────────────────── */

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const chartData = months.map((m) => ({
    month: m,
    ventas: 0,
    compras: 0
}));

/* ── Sub-components ──────────────────────────────────────────────────── */

function FinancialStatItem({
    icon,
    iconBg,
    label,
    value,
}: {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string;
}) {
    return (
        <Box className="flex items-center gap-3" sx={{ py: 1.5 }}>
            <Avatar
                sx={{
                    width: 36,
                    height: 36,
                    bgcolor: iconBg,
                    color: 'white',
                    '& .MuiSvgIcon-root': { fontSize: 18 }
                }}
            >
                {icon}
            </Avatar>
            <Box>
                <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                    {label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

function SidebarInfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                    display: 'block',
                    mb: 0.25
                }}
            >
                {label}
            </Typography>
            {children}
        </Box>
    );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <Box className="flex items-center justify-between" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '0.95rem' }}>
                {children}
            </Typography>
            {action}
        </Box>
    );
}

/* ── Main Component ──────────────────────────────────────────────────── */

export default function PartnerProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const { partner, isLoading, isError } = useShowPartner(Number(id));
    const { paymentMethods } = useIndexPaymentMethods();
    const [tabValue, setTabValue] = useState(0);

    if (isLoading) return <FuseLoading />;

    if (isError || !partner) {
        return (
            <Box className="flex items-center justify-center h-full">
                <Typography variant="h6" color="text.secondary">
                    No se encontró el socio solicitado.
                </Typography>
            </Box>
        );
    }

    const name = partner.name || 'Sin nombre';
    const defaultContact = partner.contact?.find(c => c.default) || (partner.contact?.[0] ?? null);
    const defaultAddress = partner.address?.find(a => a.default) || (partner.address?.[0] ?? null);
    const paymentMethodName = paymentMethods?.find(pm => pm.id === partner.payment_method_id)?.name;

    const showSaleTaxes = partner.role === 'client' || partner.role === 'client_supplier';
    const showPurchaseTaxes = partner.role === 'supplier' || partner.role === 'client_supplier';

    return (
        <FusePageSimple
            header={
                <Box sx={{ width: '100%', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                    {/* Top bar: breadcrumb + actions */}
                    <Box className="flex items-center justify-between" sx={{ px: 3, pt: 2, pb: 1 }}>
                        <PageBreadcrumb className="mb-0" />
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small">
                                <ContentCopy fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <MoreVert fontSize="small" />
                            </IconButton>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                startIcon={<Add sx={{ fontSize: 18 }} />}
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1 }}
                            >
                                Nuevo
                            </Button>
                        </Stack>
                    </Box>

                    {/* Partner identity row */}
                    <Box className="flex items-center gap-3" sx={{ px: 3, pb: 1.5 }}>
                        <IconButton
                            size="small"
                            onClick={() => navigate('/partners')}
                            sx={{ color: 'text.secondary' }}
                        >
                            <ArrowBack fontSize="small" />
                        </IconButton>

                        {/* Avatar/icon */}
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'text.secondary'
                            }}
                        >
                            {typeIcons[partner.type] || typeIcons['company']}
                        </Avatar>

                        {/* Name + subtitle */}
                        <Box>
                            <Box className="flex items-center gap-2">
                                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                    {name}
                                </Typography>
                                {partner.comercial_name && (
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                                        ({partner.comercial_name})
                                    </Typography>
                                )}
                            </Box>
                            <Box className="flex items-center gap-2" sx={{ mt: 0.25 }}>
                                <Chip
                                    label={roleLabels[partner.role] || partner.role}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        bgcolor: alpha(
                                            partner.role === 'client' ? '#4caf50'
                                                : partner.role === 'supplier' ? '#2196f3'
                                                    : partner.role === 'client_supplier' ? '#9c27b0'
                                                        : '#9e9e9e',
                                            0.12
                                        ),
                                        color: partner.role === 'client' ? '#4caf50'
                                            : partner.role === 'supplier' ? '#2196f3'
                                                : partner.role === 'client_supplier' ? '#9c27b0'
                                                    : '#9e9e9e'
                                    }}
                                />
                                <Chip
                                    label={typeLabels[partner.type] || partner.type}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 500 }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={tabValue}
                        onChange={(_, v) => setTabValue(v)}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ px: 3, minHeight: 40 }}
                    >
                        <Tab label="Resumen" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 40, py: 0 }} />
                        <Tab label="Impuestos" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 40, py: 0 }} />
                        <Tab label="Archivos" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 40, py: 0 }} />
                    </Tabs>
                </Box>
            }
            content={
                <Box sx={{ width: '100%', height: '100%' }}>
                    {/* ── TAB: Resumen ─────────────────────────────────── */}
                    {tabValue === 0 && (
                        <Box className="flex" sx={{ height: '100%' }}>

                            {/* ── Left Sidebar ─────────────────────────── */}
                            <Box
                                sx={{
                                    width: 320,
                                    flexShrink: 0,
                                    borderRight: 1,
                                    borderColor: 'divider',
                                    p: 3,
                                    overflowY: 'auto'
                                }}
                            >
                                {/* Contact Info */}
                                <SidebarInfoRow label="Email">
                                    {defaultContact?.email ? (
                                        <MuiLink
                                            href={`mailto:${defaultContact.email}`}
                                            underline="hover"
                                            sx={{ fontSize: '0.85rem', fontWeight: 500 }}
                                        >
                                            {defaultContact.email}
                                        </MuiLink>
                                    ) : (
                                        <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.85rem' }}>
                                            Sin email
                                        </Typography>
                                    )}
                                </SidebarInfoRow>

                                <SidebarInfoRow label="Teléfono">
                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.85rem' }}>
                                        {defaultContact?.phone || 'Sin teléfono'}
                                    </Typography>
                                </SidebarInfoRow>

                                <Divider sx={{ my: 2 }} />

                                {/* Dirección */}
                                <SectionTitle>Dirección</SectionTitle>
                                {defaultAddress ? (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                                            {defaultAddress.street && <>{defaultAddress.street}<br /></>}
                                            {defaultAddress.city && <>{defaultAddress.city}, </>}
                                            {defaultAddress.state && <>{defaultAddress.state}<br /></>}
                                            {defaultAddress.postal_code && <>{defaultAddress.postal_code}<br /></>}
                                            {defaultAddress.country || ''}
                                        </Typography>
                                        <Button
                                            size="small"
                                            startIcon={<LocationOn sx={{ fontSize: 16 }} />}
                                            sx={{ textTransform: 'none', mt: 0.5, p: 0, minWidth: 0, fontSize: '0.8rem', fontWeight: 600 }}
                                            onClick={() => {
                                                const q = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.country}`;
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');
                                            }}
                                        >
                                            Ver en mapa
                                        </Button>
                                    </Box>
                                ) : (
                                    <Button
                                        size="small"
                                        startIcon={<Add sx={{ fontSize: 16 }} />}
                                        sx={{ textTransform: 'none', p: 0, minWidth: 0, fontSize: '0.8rem', fontWeight: 600, color: 'primary.main' }}
                                    >
                                        Asignar dirección
                                    </Button>
                                )}

                                <Divider sx={{ my: 2 }} />

                                {/* Datos Fiscales */}
                                <SectionTitle>Datos Fiscales</SectionTitle>
                                <SidebarInfoRow label="CIF">
                                    <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                        {partner.cif || '—'}
                                    </Typography>
                                </SidebarInfoRow>
                                <SidebarInfoRow label="NIF / VAT">
                                    <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                        {partner.vat_number || '—'}
                                    </Typography>
                                </SidebarInfoRow>
                                <SidebarInfoRow label="Método de Pago">
                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.85rem' }}>
                                        {paymentMethodName || '—'}
                                    </Typography>
                                </SidebarInfoRow>

                                <Divider sx={{ my: 2 }} />

                                {/* Quick Actions */}
                                <SectionTitle>Acciones rápidas</SectionTitle>
                                <Stack spacing={0.5}>
                                    <Button
                                        size="small"
                                        startIcon={<Edit sx={{ fontSize: 16 }} />}
                                        onClick={() => navigate(`/partners/${partner.id}/edit`)}
                                        sx={{ textTransform: 'none', justifyContent: 'flex-start', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary' }}
                                    >
                                        Editar socio
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<WhatsApp sx={{ fontSize: 16, color: '#25D366' }} />}
                                        disabled={!defaultContact?.phone}
                                        onClick={() => {
                                            if (defaultContact?.phone) {
                                                window.open(`https://wa.me/${defaultContact.phone.replace(/\D/g, '')}`, '_blank');
                                            }
                                        }}
                                        sx={{ textTransform: 'none', justifyContent: 'flex-start', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary' }}
                                    >
                                        WhatsApp
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<Mail sx={{ fontSize: 16 }} />}
                                        disabled={!defaultContact?.email}
                                        onClick={() => {
                                            if (defaultContact?.email) {
                                                window.location.href = `mailto:${defaultContact.email}`;
                                            }
                                        }}
                                        sx={{ textTransform: 'none', justifyContent: 'flex-start', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary' }}
                                    >
                                        Enviar email
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<Phone sx={{ fontSize: 16 }} />}
                                        disabled={!defaultContact?.phone}
                                        onClick={() => {
                                            if (defaultContact?.phone) {
                                                window.location.href = `tel:${defaultContact.phone}`;
                                            }
                                        }}
                                        sx={{ textTransform: 'none', justifyContent: 'flex-start', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary' }}
                                    >
                                        Llamar
                                    </Button>
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                {/* Personas de contacto */}
                                <SectionTitle>Personas de contacto</SectionTitle>
                                {partner.contact && partner.contact.length > 0 ? (
                                    <Stack spacing={1.5}>
                                        {partner.contact.map((c, idx) => (
                                            <Box
                                                key={idx}
                                                className="flex items-center gap-2"
                                            >
                                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main' }}>
                                                    {(c.email || '?')[0].toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '0.8rem' }}>
                                                        {c.email || 'Sin email'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>
                                                        {c.phone || 'Sin teléfono'}
                                                    </Typography>
                                                </Box>
                                                {c.default && (
                                                    <Chip label="Principal" size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: '0.55rem' }} />
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Button
                                        size="small"
                                        startIcon={<Add sx={{ fontSize: 16 }} />}
                                        sx={{ textTransform: 'none', p: 0, minWidth: 0, fontSize: '0.8rem', fontWeight: 600, color: 'primary.main' }}
                                    >
                                        Añadir persona
                                    </Button>
                                )}

                                <Divider sx={{ my: 2 }} />

                                {/* Bank Accounts */}
                                <SectionTitle>Cuentas Bancarias</SectionTitle>
                                {partner.bank_accounts && partner.bank_accounts.length > 0 ? (
                                    <Stack spacing={1}>
                                        {partner.bank_accounts.map((acc, idx) => (
                                            <Box key={idx}>
                                                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                                                    {acc.name || `Cuenta ${idx + 1}`}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                                    {acc.account_number || '—'}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                                        Sin cuentas bancarias
                                    </Typography>
                                )}
                            </Box>

                            {/* ── Right Content ────────────────────────── */}
                            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>

                                {/* Próximas actividades */}
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, mb: 3 }}>
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

                                {/* Ventas / Compras chart + Financial stats */}
                                <Paper variant="outlined" sx={{ borderRadius: 1, mb: 3, overflow: 'hidden' }}>
                                    <Box className="flex" sx={{ minHeight: 350 }}>
                                        {/* Chart area */}
                                        <Box sx={{ flex: 1, p: 3, borderRight: 1, borderColor: 'divider' }}>
                                            {/* Legend */}
                                            <Box className="flex items-center justify-between" sx={{ mb: 2 }}>
                                                <Box className="flex items-center gap-4">
                                                    <Box className="flex items-center gap-1.5">
                                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50' }} />
                                                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                                                            Ventas
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                            0,00€
                                                        </Typography>
                                                    </Box>
                                                    <Box className="flex items-center gap-1.5">
                                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f44336' }} />
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
                                                        tickFormatter={(v) => `${v}€`}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            background: theme.palette.background.paper,
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            borderRadius: 4,
                                                            fontSize: 12
                                                        }}
                                                        formatter={(value: number) => [`${value.toFixed(2)}€`]}
                                                    />
                                                    <Bar dataKey="ventas" fill="#4caf50" radius={[3, 3, 0, 0]} name="Ventas" />
                                                    <Bar dataKey="compras" fill="#f44336" radius={[3, 3, 0, 0]} name="Compras" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>

                                        {/* Financial stats */}
                                        <Box sx={{ width: 280, flexShrink: 0, p: 2.5 }}>
                                            <Box className="grid grid-cols-2 gap-x-2">
                                                <FinancialStatItem
                                                    icon={<CheckCircle />}
                                                    iconBg="#4caf50"
                                                    label="Total cobrado"
                                                    value="0,00€"
                                                />
                                                <FinancialStatItem
                                                    icon={<Cancel />}
                                                    iconBg="#f44336"
                                                    label="Total pagado"
                                                    value="0,00€"
                                                />
                                                <FinancialStatItem
                                                    icon={<TrendingUp />}
                                                    iconBg="#4caf50"
                                                    label="Pendiente cobro"
                                                    value="0,00€"
                                                />
                                                <FinancialStatItem
                                                    icon={<TrendingDown />}
                                                    iconBg="#f44336"
                                                    label="Pendiente pago"
                                                    value="0,00€"
                                                />
                                                <FinancialStatItem
                                                    icon={<Receipt />}
                                                    iconBg="#ff9800"
                                                    label="Pagos a cuenta"
                                                    value="0,00€"
                                                />
                                                <FinancialStatItem
                                                    icon={<ShoppingCart />}
                                                    iconBg="#ff9800"
                                                    label="Pagos a cuenta"
                                                    value="0,00€"
                                                />
                                            </Box>

                                            <Divider sx={{ my: 1.5 }} />

                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#9c27b0', display: 'inline-block' }} />
                                                No hay presupuestos pendientes
                                            </Typography>

                                            <Divider sx={{ my: 1.5 }} />

                                            {/* Quick creation buttons */}
                                            <Box className="flex gap-2">
                                                <Button
                                                    size="small"
                                                    startIcon={<Add sx={{ fontSize: 14 }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'primary.main' }}
                                                >
                                                    Factura
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<Add sx={{ fontSize: 14 }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'primary.main' }}
                                                >
                                                    Compra
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>

                                {/* Bottom row: Oportunidades + Notas */}
                                <Box className="grid grid-cols-2 gap-3">
                                    {/* Oportunidades abiertas */}
                                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
                                        <SectionTitle>Oportunidades abiertas</SectionTitle>
                                        <Box className="flex items-center gap-3">
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#2196f3', 0.12), color: '#2196f3' }}>
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

                                    {/* Notas */}
                                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
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
                        </Box>
                    )}

                    {/* ── TAB: Impuestos ───────────────────────────────── */}
                    {tabValue === 1 && (
                        <Box sx={{ p: 3, maxWidth: 900 }}>
                            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {showSaleTaxes && (
                                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
                                        <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: '0.1em', fontSize: '0.65rem', color: 'text.secondary', display: 'block', mb: 2 }}>
                                            Impuestos de Venta
                                        </Typography>
                                        {partner.sale_taxes && partner.sale_taxes.length > 0 ? (
                                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                                {partner.sale_taxes.map((tax) => (
                                                    <Chip
                                                        key={tax.id}
                                                        label={`${tax.name} (${tax.percentage}%)`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha('#4caf50', 0.1),
                                                            color: '#4caf50',
                                                            fontWeight: 500,
                                                            borderColor: alpha('#4caf50', 0.3),
                                                            border: '1px solid'
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">Sin impuestos de venta asignados</Typography>
                                        )}
                                    </Paper>
                                )}
                                {showPurchaseTaxes && (
                                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
                                        <Typography variant="overline" fontWeight={700} sx={{ letterSpacing: '0.1em', fontSize: '0.65rem', color: 'text.secondary', display: 'block', mb: 2 }}>
                                            Impuestos de Compra
                                        </Typography>
                                        {partner.purchase_taxes && partner.purchase_taxes.length > 0 ? (
                                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                                {partner.purchase_taxes.map((tax) => (
                                                    <Chip
                                                        key={tax.id}
                                                        label={`${tax.name} (${tax.percentage}%)`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha('#2196f3', 0.1),
                                                            color: '#2196f3',
                                                            fontWeight: 500,
                                                            borderColor: alpha('#2196f3', 0.3),
                                                            border: '1px solid'
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">Sin impuestos de compra asignados</Typography>
                                        )}
                                    </Paper>
                                )}
                                {!showSaleTaxes && !showPurchaseTaxes && (
                                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 1, textAlign: 'center', gridColumn: '1 / -1' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Este tipo de socio no tiene impuestos configurables
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* ── TAB: Archivos ─────────────────────────────────── */}
                    {tabValue === 2 && (
                        <Box sx={{ p: 3 }}>
                            <Paper variant="outlined" sx={{ p: 4, borderRadius: 1, textAlign: 'center' }}>
                                <Typography variant="body1" color="text.secondary">
                                    No hay archivos adjuntos para este socio
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<Add sx={{ fontSize: 16 }} />}
                                    sx={{ textTransform: 'none', fontWeight: 600, mt: 1 }}
                                >
                                    Subir archivo
                                </Button>
                            </Paper>
                        </Box>
                    )}
                </Box>
            }
            scroll="content"
        />
    );
}
