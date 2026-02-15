import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    Avatar,
    Chip,
    Dialog,
    DialogContent,
    IconButton,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Edit,
    WhatsApp,
    Mail,
    Phone,
    LocationOn,
    Add,
    Close,
    Badge,
    Print,
    ContentCopy,
    Receipt,
    ShoppingCart,
    Business,
    AccountBalance,
    Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { SectionTitle, roleLabels, typeLabels, roleColors } from './PartnerProfileShared';

interface PartnerProfileSidebarProps {
    partner: PartnerEntity;
}

export default function PartnerProfileSidebar({ partner }: PartnerProfileSidebarProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [fichaOpen, setFichaOpen] = useState(false);
    const defaultContact = partner.contact?.find(c => c.default) || (partner.contact?.[0] ?? null);
    const defaultAddress = partner.address?.find(a => a.default) || (partner.address?.[0] ?? null);

    const actionBtnSx = {
        flex: '1 1 auto',
        textTransform: 'none',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '0.8rem',
        color: 'text.primary',
        borderRadius: 0.5,
        py: 0.5,
        borderColor: 'divider',
        '&:hover': { bgcolor: 'action.hover', borderColor: 'divider' },
    } as const;

    return (
        <Box
            sx={{
                width: { xs: '100%', md: 400 },
                flexShrink: 0,
                borderRight: { xs: 0, md: 1 },
                borderBottom: { xs: 1, md: 0 },
                borderColor: 'divider',
                p: 3,
                overflowY: { xs: 'visible', md: 'auto' },
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* ──── 1. Acciones Rápidas ────────────────────────────────── */}
            <Box className="flex flex-wrap gap-2 mb-2">
                <Button size="small" variant="outlined" color="inherit" startIcon={<Edit sx={{ fontSize: 16 }} />}
                    onClick={() => navigate(`/partners/${partner.id}/edit`)} sx={actionBtnSx}>
                    Editar
                </Button>
                <Button size="small" variant="outlined" color="inherit" startIcon={<WhatsApp sx={{ fontSize: 16 }} />}
                    disabled={!defaultContact?.phone}
                    onClick={() => { if (defaultContact?.phone) window.open(`https://wa.me/${defaultContact.phone.replace(/\D/g, '')}`, '_blank'); }}
                    sx={actionBtnSx}>
                    WhatsApp
                </Button>
                <Button size="small" variant="outlined" color="inherit" startIcon={<Mail sx={{ fontSize: 16 }} />}
                    disabled={!defaultContact?.email}
                    onClick={() => { if (defaultContact?.email) window.location.href = `mailto:${defaultContact.email}`; }}
                    sx={actionBtnSx}>
                    Email
                </Button>
                <Button size="small" variant="outlined" color="inherit" startIcon={<Phone sx={{ fontSize: 16 }} />}
                    disabled={!defaultContact?.phone}
                    onClick={() => { if (defaultContact?.phone) window.location.href = `tel:${defaultContact.phone}`; }}
                    sx={actionBtnSx}>
                    Llamar
                </Button>
            </Box>

            {/* ──── 2. Chips de estado ─────────────────────────────────── */}
            <Box className="flex gap-2 mb-3">
                <Chip
                    label={partner.credit_available ? 'Crédito: Sí' : 'Crédito: No'}
                    size="small" variant="filled"
                    sx={{ flex: 1, fontWeight: 500, fontSize: '0.75rem', bgcolor: 'action.selected', color: 'text.secondary' }}
                />
                <Chip
                    label={partner.grouped_billing ? 'Fct. Agrupada: Sí' : 'Fct. Agrupada: No'}
                    size="small" variant="filled"
                    sx={{ flex: 1, fontWeight: 500, fontSize: '0.75rem', bgcolor: 'action.selected', color: 'text.secondary' }}
                />
            </Box>

            {/* ──── 3. Contacto principal ──────────────────────────────── */}
            <Divider sx={{ my: 2 }} />
            <SectionTitle>Contacto principal</SectionTitle>
            {defaultContact ? (
                <Box className="flex items-start gap-3">
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'action.selected', mt: 0.5 }}>
                        {(defaultContact.email || '?')[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '0.85rem' }}>
                            {defaultContact.email || 'Sin email'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {defaultContact.phone || 'Sin teléfono'}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Button size="small" startIcon={<Add sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', p: 0, minWidth: 0, fontSize: '0.8rem', fontWeight: 600, color: 'primary.main' }}>
                    Añadir contacto
                </Button>
            )}

            {/* ──── 4. Dirección ───────────────────────────────────────── */}
            <Divider sx={{ my: 2 }} />
            <SectionTitle>Dirección</SectionTitle>
            {defaultAddress ? (
                <Box className="flex items-start gap-3">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected', color: 'text.secondary', mt: 0.5 }}>
                        <LocationOn sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                            {defaultAddress.country && <span className="font-semibold">{defaultAddress.country}, </span>}
                            {defaultAddress.city && <>{defaultAddress.city}, </>}
                            {defaultAddress.street}
                        </Typography>
                        <Button size="small"
                            sx={{ textTransform: 'none', mt: 0.5, p: 0, minWidth: 0, fontSize: '0.75rem', fontWeight: 600 }}
                            onClick={() => {
                                const q = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.country}`;
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');
                            }}>
                            Ver en mapa
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Button size="small" startIcon={<Add sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', p: 0, minWidth: 0, fontSize: '0.8rem', fontWeight: 600, color: 'primary.main' }}>
                    Asignar dirección
                </Button>
            )}

            {/* ──── Spacer ─────────────────────────────────────────────── */}
            <Box sx={{ flex: 1 }} />

            {/* ──── 5. Panel inferior: Documentos y Fichas ─────────────── */}
            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Typography variant="caption" fontWeight={700} color="text.secondary"
                    sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', px: 1, mb: 0.5 }}>
                    Documentos
                </Typography>
                <Button
                    fullWidth size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<Badge sx={{ fontSize: 18 }} />}
                    onClick={() => setFichaOpen(true)}
                    sx={{
                        textTransform: 'none', fontWeight: 600, fontSize: '0.85rem',
                        justifyContent: 'flex-start', borderRadius: 1,
                        py: 1, px: 1.5,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' },
                    }}
                >
                    Ver Ficha Técnica
                </Button>
                <Button
                    fullWidth size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<Receipt sx={{ fontSize: 18 }} />}
                    sx={{
                        textTransform: 'none', fontWeight: 600, fontSize: '0.85rem',
                        justifyContent: 'flex-start', borderRadius: 1,
                        py: 1, px: 1.5,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' },
                    }}
                >
                    Informes de Venta
                </Button>
                <Button
                    fullWidth size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
                    sx={{
                        textTransform: 'none', fontWeight: 600, fontSize: '0.85rem',
                        justifyContent: 'flex-start', borderRadius: 1,
                        py: 1, px: 1.5,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' },
                    }}
                >
                    Informes de Compra
                </Button>
            </Box>

            {/* ──── Ficha Técnica Dialog ────────────────────────────────── */}
            <FichaTecnicaDialog open={fichaOpen} onClose={() => setFichaOpen(false)} partner={partner} />
        </Box>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   FICHA TÉCNICA DIALOG — Structured professional ERP layout
   ═══════════════════════════════════════════════════════════════════════ */

const typeIcons: Record<string, React.ReactNode> = {
    company: <Business sx={{ fontSize: 22 }} />,
    person: <Person sx={{ fontSize: 22 }} />,
    public_organism: <AccountBalance sx={{ fontSize: 22 }} />,
    prospect: <Person sx={{ fontSize: 22 }} />,
};

function SectionHeader({ title }: { title: string }) {
    return (
        <Typography variant="overline" fontWeight={700}
            sx={{ fontSize: '0.65rem', color: 'text.secondary', letterSpacing: '0.08em', display: 'block', mt: 3, mb: 1.5, px: 0.5 }}>
            {title}
        </Typography>
    );
}

function FieldRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <Box sx={{ display: 'flex', py: 0.8, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
            <Typography variant="body2" color="text.secondary"
                sx={{ width: { xs: '35%', sm: 180 }, flexShrink: 0, fontSize: '0.8rem', fontWeight: 500 }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={500}
                sx={{ fontSize: '0.85rem', flex: 1, ...(mono ? { fontFamily: 'monospace', letterSpacing: '0.02em' } : {}) }}>
                {value}
            </Typography>
        </Box>
    );
}

function FichaTecnicaDialog({ open, onClose, partner }: { open: boolean; onClose: () => void; partner: PartnerEntity }) {
    const theme = useTheme();
    const defaultContact = partner.contact?.find(c => c.default) || (partner.contact?.[0] ?? null);
    const defaultAddress = partner.address?.find(a => a.default) || (partner.address?.[0] ?? null);
    const accentColor = roleColors[partner.role] || theme.palette.primary.main;

    const allData = {
        general: [
            { label: 'ID', value: String(partner.id) },
            { label: 'Nombre Legal', value: partner.name || '—' },
            { label: 'Nombre Comercial', value: partner.comercial_name || '—' },
            { label: 'Tipo de Entidad', value: typeLabels[partner.type] || partner.type },
            { label: 'Rol Comercial', value: roleLabels[partner.role] || partner.role },
        ],
        fiscal: [
            { label: 'CIF', value: partner.cif || '—', mono: true },
            { label: 'NIF / VAT', value: partner.vat_number || '—', mono: true },
        ],
        commercial: [
            { label: 'Crédito Disponible', value: partner.credit_available ? 'Sí' : 'No' },
            { label: 'Facturación Agrupada', value: partner.grouped_billing ? 'Sí' : 'No' },
            { label: 'Sitio Web', value: (partner as any).website || '—' },
        ],
        contact: [
            { label: 'Email', value: defaultContact?.email || '—' },
            { label: 'Teléfono', value: defaultContact?.phone || '—' },
        ],
        address: [
            {
                label: 'Dirección',
                value: defaultAddress
                    ? [defaultAddress.street, defaultAddress.city, defaultAddress.state, defaultAddress.country].filter(Boolean).join(', ')
                    : '—',
            },
        ],
        banks: partner.bank_accounts?.map((acc, i) => ({
            label: acc.name || `Cuenta ${i + 1}`,
            value: [acc.account_holder, acc.account_number, acc.swift].filter(Boolean).join(' · ') || '—',
            mono: true,
        })) || [],
    };

    const flatRows = [
        ...allData.general,
        ...allData.fiscal,
        ...allData.commercial,
        ...allData.contact,
        ...allData.address,
        ...allData.banks,
    ];

    const handleCopy = async () => {
        const text = flatRows.map(r => `${r.label}: ${r.value}`).join('\n');
        await navigator.clipboard.writeText(text);
    };

    const handlePrint = () => {
        const sections = [
            { title: 'Información General', rows: allData.general },
            { title: 'Datos Fiscales', rows: allData.fiscal },
            { title: 'Datos Comerciales', rows: allData.commercial },
            { title: 'Contacto', rows: allData.contact },
            { title: 'Dirección', rows: allData.address },
            ...(allData.banks.length > 0 ? [{ title: 'Cuentas Bancarias', rows: allData.banks }] : []),
        ];
        const w = window.open('', '_blank');
        if (w) {
            w.document.write(`<html><head><title>Ficha - ${partner.name}</title>
              <style>
                body{font-family:system-ui,-apple-system,sans-serif;padding:40px 48px;color:#1a1a1a;max-width:700px;margin:0 auto}
                h1{font-size:18px;margin:0 0 4px}
                .sub{font-size:13px;color:#666;margin-bottom:24px}
                h2{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:24px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px}
                table{width:100%;border-collapse:collapse;margin-bottom:4px}
                td{padding:6px 0;font-size:13px;border-bottom:1px solid #f5f5f5}
                td:first-child{color:#888;width:180px;font-weight:500}
                .mono{font-family:monospace;letter-spacing:0.5px}
              </style></head><body>
              <h1>${partner.name}</h1>
              <div class="sub">${partner.comercial_name || ''} · ${typeLabels[partner.type] || partner.type} · ${roleLabels[partner.role] || partner.role}</div>
              ${sections.map(s => `<h2>${s.title}</h2><table>${s.rows.map(r => `<tr><td>${r.label}</td><td${(r as any).mono ? ' class="mono"' : ''}>${r.value}</td></tr>`).join('')}</table>`).join('')}
              </body></html>`);
            w.document.close();
            w.print();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}>

            {/* ── Header ──────────────────────────────────────────────── */}
            <Box sx={{
                px: 3, pt: 3, pb: 2,
                background: `linear-gradient(135deg, ${alpha(accentColor, 0.08)}, transparent)`,
                borderBottom: 1, borderColor: 'divider',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{
                            width: 48, height: 48,
                            bgcolor: alpha(accentColor, 0.15),
                            color: accentColor,
                        }}>
                            {typeIcons[partner.type] || typeIcons['company']}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.05rem', lineHeight: 1.2 }}>
                                {partner.name}
                            </Typography>
                            {partner.comercial_name && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                    {partner.comercial_name}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75 }}>
                                <Chip label={roleLabels[partner.role] || partner.role} size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: alpha(accentColor, 0.12), color: accentColor, height: 22 }} />
                                <Chip label={typeLabels[partner.type] || partner.type} size="small" variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 22 }} />
                                <Chip label={`ID: ${partner.id}`} size="small" variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 22, fontFamily: 'monospace' }} />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: -0.5 }}>
                        <IconButton size="small" onClick={handleCopy} title="Copiar al portapapeles">
                            <ContentCopy sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton size="small" onClick={handlePrint} title="Imprimir ficha">
                            <Print sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton size="small" onClick={onClose}>
                            <Close sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* ── Body ────────────────────────────────────────────────── */}
            <DialogContent sx={{ px: 3, py: 0, pb: 3 }}>

                {/* Datos Fiscales */}
                <SectionHeader title="Datos Fiscales" />
                {allData.fiscal.map(r => <FieldRow key={r.label} {...r} />)}

                {/* Datos Comerciales */}
                <SectionHeader title="Datos Comerciales" />
                {allData.commercial.map(r => <FieldRow key={r.label} {...r} />)}

                {/* Contacto */}
                <SectionHeader title="Contacto" />
                {allData.contact.map(r => <FieldRow key={r.label} {...r} />)}

                {/* Dirección */}
                <SectionHeader title="Dirección" />
                {allData.address.map(r => <FieldRow key={r.label} {...r} />)}

                {/* Cuentas Bancarias */}
                {allData.banks.length > 0 && (
                    <>
                        <SectionHeader title="Cuentas Bancarias" />
                        {allData.banks.map((r, i) => <FieldRow key={i} {...r} />)}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
