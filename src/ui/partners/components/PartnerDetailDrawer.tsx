import { useNavigate } from 'react-router';
import {
    Drawer,
    Box,
    Typography,
    Avatar,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Stack,
    alpha,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import {
    Close,
    OpenInNew,
    Phone,
    LocationOn,
    AccountBalance,
    Receipt,
    WhatsApp,
    Mail,
    ContentCopy,
    Business,
    Badge,
    Storefront,
    LocalShipping
} from '@mui/icons-material';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { PartnerTax } from '@/domain/entities/partners/DTOs/PartnerDTOs';

interface PartnerDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    partner: PartnerEntity | null;
}

const DRAWER_WIDTH = 480;

const roleLabels: Record<string, string> = {
    client: 'Cliente',
    supplier: 'Proveedor',
    client_supplier: 'Cliente / Proveedor',
    prospect: 'Prospecto'
};

const typeLabels: Record<string, string> = {
    company: 'Empresa',
    person: 'Persona',
    public_organism: 'Organismo Público',
    prospect: 'Prospecto'
};

const roleColors: Record<string, string> = {
    client: '#4caf50',
    supplier: '#2196f3',
    client_supplier: '#9c27b0',
    prospect: '#9e9e9e'
};

const roleIcons: Record<string, React.ReactNode> = {
    client: <Storefront fontSize="small" />,
    supplier: <LocalShipping fontSize="small" />,
    client_supplier: <Business fontSize="small" />,
    prospect: <Badge fontSize="small" />
};

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
}

function getInitials(fullName: string) {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
}

/* ── Reusable sub-components ─────────────────────────────────────────── */

function SectionHeader({ title }: { title: string }) {
    return (
        <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={700}
            sx={{ px: 3, pt: 2, pb: 0.5, display: 'block', letterSpacing: '0.08em' }}
        >
            {title}
        </Typography>
    );
}

interface InfoRowProps {
    label: string;
    value?: string | React.ReactNode;
    mono?: boolean;
    copyable?: boolean;
}

function InfoRow({ label, value, mono, copyable }: InfoRowProps) {
    const isEmpty = !value || value === '';
    const displayValue = isEmpty ? '—' : value;

    const handleCopy = () => {
        if (!isEmpty && typeof value === 'string') {
            navigator.clipboard.writeText(value);
        }
    };

    return (
        <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
            <TableCell
                sx={{
                    py: 0.75,
                    px: 3,
                    width: '38%',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    verticalAlign: 'top'
                }}
            >
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {label}
                </Typography>
            </TableCell>
            <TableCell
                sx={{
                    py: 0.75,
                    px: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    verticalAlign: 'top'
                }}
            >
                <Box className="flex items-center gap-1">
                    <Typography
                        variant="body2"
                        color={isEmpty ? 'text.disabled' : 'text.primary'}
                        sx={mono ? { fontFamily: 'monospace', fontSize: '0.8rem' } : undefined}
                    >
                        {displayValue}
                    </Typography>
                    {copyable && !isEmpty && typeof value === 'string' && (
                        <Tooltip title="Copiar">
                            <IconButton size="small" onClick={handleCopy} sx={{ opacity: 0.3, '&:hover': { opacity: 1 } }}>
                                <ContentCopy sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </TableCell>
        </TableRow>
    );
}

function TaxChips({ taxes, color }: { taxes: PartnerTax[]; color: string }) {
    if (!taxes || taxes.length === 0) {
        return <Typography variant="body2" color="text.disabled" sx={{ px: 3, py: 1 }}>Sin impuestos asignados</Typography>;
    }
    return (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ px: 3, py: 0.5 }}>
            {taxes.map((tax) => (
                <Chip
                    key={tax.id}
                    label={`${tax.name} (${tax.percentage}%)`}
                    size="small"
                    sx={{
                        bgcolor: alpha(color, 0.1),
                        color: color,
                        fontWeight: 500,
                        borderColor: alpha(color, 0.3),
                        border: '1px solid'
                    }}
                />
            ))}
        </Stack>
    );
}

/* ── Main Component ──────────────────────────────────────────────────── */

export default function PartnerDetailDrawer({ open, onClose, partner }: PartnerDetailDrawerProps) {
    const navigate = useNavigate();

    if (!partner) return null;

    const name = partner.name || 'Sin nombre';
    const defaultAddress = partner.address && partner.address.length > 0 ? partner.address[0] : null;
    const defaultContact = partner.contact && partner.contact.length > 0 ? partner.contact[0] : null;
    const defaultBank = partner.bank_accounts && partner.bank_accounts.length > 0 ? partner.bank_accounts[0] : null;

    const showSaleTaxes = partner.role === 'client' || partner.role === 'client_supplier';
    const showPurchaseTaxes = partner.role === 'supplier' || partner.role === 'client_supplier';

    const addressCount = partner.address?.length || 0;
    const contactCount = partner.contact?.length || 0;
    const bankCount = partner.bank_accounts?.length || 0;

    const handleGoToProfile = () => {
        navigate(`/partners/${partner.id}`);
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    width: DRAWER_WIDTH,
                    maxWidth: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: 'background.default'
                }}
                role="presentation"
            >
                {/* ── Header ────────────────────────────────────────────── */}
                <Box
                    sx={{
                        p: 2.5,
                        pb: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e2a2a' : '#e0eded'
                    }}
                >
                    {/* Toolbar */}
                    <Box className="flex items-center justify-between" sx={{ mb: 2 }}>
                        <Tooltip title="Ver Perfil Completo">
                            <IconButton onClick={handleGoToProfile} color="primary">
                                <OpenInNew />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Partner identity */}
                    <Box className="flex items-center gap-3">
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: stringToColor(name),
                                fontSize: '1rem',
                                fontWeight: 700
                            }}
                        >
                            {getInitials(name)}
                        </Avatar>
                        <Box className="flex-1 min-w-0">
                            <Typography variant="subtitle1" fontWeight={700} className="truncate" lineHeight={1.3}>
                                {name}
                            </Typography>
                            {partner.comercial_name && (
                                <Typography variant="body2" color="text.secondary" className="truncate" lineHeight={1.3}>
                                    {partner.comercial_name}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Chips */}
                    <Stack direction="row" gap={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                        <Chip
                            icon={roleIcons[partner.role] as React.ReactElement || undefined}
                            label={roleLabels[partner.role] || partner.role}
                            size="small"
                            sx={{
                                bgcolor: alpha(roleColors[partner.role] || '#666', 0.12),
                                color: roleColors[partner.role] || '#666',
                                fontWeight: 600,
                                fontSize: '0.75rem'
                            }}
                        />
                        <Chip
                            label={typeLabels[partner.type] || partner.type}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                        />
                    </Stack>

                    {/* Quick Actions */}
                    <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={!defaultContact?.phone}
                            onClick={() => {
                                if (defaultContact?.phone) {
                                    const phone = defaultContact.phone.replace(/\D/g, '');
                                    window.open(`https://wa.me/${phone}`, '_blank');
                                }
                            }}
                            startIcon={<WhatsApp sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: 'none',
                                borderColor: 'rgba(0,0,0,0.2)',
                                color: 'text.primary',
                                bgcolor: 'background.paper',
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1.5,
                                minWidth: 0,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            WhatsApp
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            disabled={!defaultContact?.email}
                            onClick={() => {
                                if (defaultContact?.email) {
                                    window.location.href = `mailto:${defaultContact.email}`;
                                }
                            }}
                            startIcon={<Mail sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: 'none',
                                borderColor: 'rgba(0,0,0,0.2)',
                                color: 'text.primary',
                                bgcolor: 'background.paper',
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1.5,
                                minWidth: 0,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            Email
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            disabled={!defaultContact?.phone}
                            onClick={() => {
                                if (defaultContact?.phone) {
                                    window.location.href = `tel:${defaultContact.phone}`;
                                }
                            }}
                            startIcon={<Phone sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: 'none',
                                borderColor: 'rgba(0,0,0,0.2)',
                                color: 'text.primary',
                                bgcolor: 'background.paper',
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1.5,
                                minWidth: 0,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            Llamar
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            disabled={!defaultAddress}
                            onClick={() => {
                                if (defaultAddress) {
                                    const q = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.country}`;
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');
                                }
                            }}
                            startIcon={<LocationOn sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: 'none',
                                borderColor: 'rgba(0,0,0,0.2)',
                                color: 'text.primary',
                                bgcolor: 'background.paper',
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1.5,
                                minWidth: 0,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            Mapa
                        </Button>
                    </Stack>
                </Box>

                {/* ── Body – scrollable ─────────────────────────────────── */}
                <Box className="flex-1 overflow-y-auto">

                    {/* Datos Fiscales */}
                    <SectionHeader title="Datos Fiscales" />
                    <Table size="small">
                        <TableBody>
                            <InfoRow label="CIF" value={partner.cif} mono copyable />
                            <InfoRow label="NIF / VAT" value={partner.vat_number} mono copyable />
                            <InfoRow label="Método de Pago" value={partner.payment_method_id ? `#${partner.payment_method_id}` : undefined} />
                        </TableBody>
                    </Table>

                    <Divider />

                    {/* Contacto Principal */}
                    <SectionHeader title={`Contacto${contactCount > 1 ? ` (1 de ${contactCount})` : ''}`} />
                    <Table size="small">
                        <TableBody>
                            <InfoRow label="Email" value={defaultContact?.email} copyable />
                            <InfoRow label="Teléfono" value={defaultContact?.phone} copyable />
                        </TableBody>
                    </Table>

                    <Divider />

                    {/* Dirección */}
                    <SectionHeader title={`Dirección${addressCount > 1 ? ` (1 de ${addressCount})` : ''}`} />
                    {defaultAddress ? (
                        <Table size="small">
                            <TableBody>
                                <InfoRow label="Calle" value={defaultAddress.street} />
                                <InfoRow label="Ciudad" value={defaultAddress.city} />
                                <InfoRow label="Provincia" value={defaultAddress.state} />
                                <InfoRow label="C.P." value={defaultAddress.postal_code} mono />
                                <InfoRow label="País" value={defaultAddress.country} />
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="body2" color="text.disabled" sx={{ px: 3, py: 1 }}>
                            Sin dirección registrada
                        </Typography>
                    )}

                    <Divider />

                    {/* Impuestos */}
                    {(showSaleTaxes || showPurchaseTaxes) && (
                        <>
                            <SectionHeader title="Impuestos Asignados" />
                            {showSaleTaxes && (
                                <Box sx={{ mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ px: 3, display: 'block', mb: 0.5 }}>
                                        Venta
                                    </Typography>
                                    <TaxChips taxes={partner.sale_taxes} color="#4caf50" />
                                </Box>
                            )}
                            {showPurchaseTaxes && (
                                <Box sx={{ mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ px: 3, display: 'block', mb: 0.5 }}>
                                        Compra
                                    </Typography>
                                    <TaxChips taxes={partner.purchase_taxes} color="#2196f3" />
                                </Box>
                            )}
                            <Divider />
                        </>
                    )}

                    {/* Cuentas Bancarias */}
                    <SectionHeader title={`Cuenta Bancaria${bankCount > 1 ? ` (1 de ${bankCount})` : ''}`} />
                    {defaultBank ? (
                        <Table size="small">
                            <TableBody>
                                <InfoRow label="Banco" value={defaultBank.name || 'Sin nombre'} />
                                <InfoRow label="Nº Cuenta" value={defaultBank.account_number} mono copyable />
                                <InfoRow label="SWIFT" value={defaultBank.swift} mono copyable />
                                <InfoRow label="Titular" value={defaultBank.account_holder} />
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="body2" color="text.disabled" sx={{ px: 3, py: 1 }}>
                            Sin cuenta bancaria registrada
                        </Typography>
                    )}

                    {/* Summary counters */}
                    <Divider />
                    <Box sx={{ px: 3, py: 1.5 }}>
                        <Typography variant="caption" color="text.disabled">
                            {addressCount} dirección{addressCount !== 1 ? 'es' : ''} · {contactCount} contacto{contactCount !== 1 ? 's' : ''} · {bankCount} cuenta{bankCount !== 1 ? 's' : ''}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}
