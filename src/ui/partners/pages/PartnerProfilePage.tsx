import { useParams, useNavigate } from 'react-router';
import { useShowPartner } from '@/features/partners/hooks/useShowPartner';
import FuseLoading from '@fuse/core/FuseLoading';
import {
    Box,
    Typography,
    Avatar,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Paper,
    Stack,
    Tab,
    Tabs,
    alpha
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Email,
    Phone,
    Language,
    LocationOn,
    AccountBalance,
    Receipt
} from '@mui/icons-material';
import { useState } from 'react';
import { PartnerTax } from '@/domain/entities/partners/DTOs/PartnerDTOs';

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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Paper variant="outlined" className="p-5 rounded-xl">
            <Typography variant="overline" color="text.secondary" fontWeight={700} className="tracking-widest mb-3 block">
                {title}
            </Typography>
            {children}
        </Paper>
    );
}

function InfoRow({ label, value, mono }: { label: string; value: string | React.ReactNode; mono?: boolean }) {
    return (
        <Box className="flex items-start gap-4 py-2">
            <Typography variant="caption" color="text.secondary" className="uppercase tracking-wider font-medium min-w-[120px] mt-0.5">
                {label}
            </Typography>
            <Typography variant="body2" sx={mono ? { fontFamily: 'monospace' } : {}}>
                {value || <span className="text-gray-400">—</span>}
            </Typography>
        </Box>
    );
}

function TaxChips({ taxes, color }: { taxes: PartnerTax[]; color: string }) {
    if (!taxes || taxes.length === 0) {
        return <Typography variant="body2" color="text.secondary">Sin impuestos asignados</Typography>;
    }
    return (
        <Stack direction="row" flexWrap="wrap" gap={1}>
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

export default function PartnerProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { partner, isLoading, isError } = useShowPartner(Number(id));
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
    const showSaleTaxes = partner.role === 'client' || partner.role === 'client_supplier';
    const showPurchaseTaxes = partner.role === 'supplier' || partner.role === 'client_supplier';

    return (
        <Box className="flex flex-col h-full overflow-auto">
            {/* Profile Header */}
            <Box
                className="relative px-8 pt-8 pb-6"
                sx={{
                    background: (theme) =>
                        `linear-gradient(135deg, ${alpha(roleColors[partner.role] || '#666', 0.12)} 0%, transparent 60%)`,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box className="flex items-center gap-2 mb-6">
                    <Tooltip title="Volver a Socios">
                        <IconButton onClick={() => navigate('/partners')}>
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary">
                        Socios
                    </Typography>
                </Box>

                <Box className="flex items-center gap-5">
                    <Avatar
                        sx={{
                            width: 72,
                            height: 72,
                            bgcolor: stringToColor(name),
                            fontSize: '1.5rem',
                            fontWeight: 700
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>
                    <Box className="flex-1 min-w-0">
                        <Typography variant="h4" fontWeight={700} className="truncate">
                            {name}
                        </Typography>
                        {partner.comercial_name && (
                            <Typography variant="body1" color="text.secondary" className="truncate mt-0.5">
                                {partner.comercial_name}
                            </Typography>
                        )}
                        <Stack direction="row" gap={1} className="mt-2">
                            <Chip
                                label={roleLabels[partner.role] || partner.role}
                                size="small"
                                sx={{
                                    bgcolor: alpha(roleColors[partner.role] || '#666', 0.15),
                                    color: roleColors[partner.role] || '#666',
                                    fontWeight: 600
                                }}
                            />
                            <Chip
                                label={typeLabels[partner.type] || partner.type}
                                size="small"
                                variant="outlined"
                            />
                        </Stack>
                    </Box>
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, v) => setTabValue(v)}
                    indicatorColor="secondary"
                    textColor="secondary"
                    className="px-8"
                >
                    <Tab label="General" />
                    <Tab label="Direcciones" />
                    <Tab label="Cuentas Bancarias" />
                    <Tab label="Impuestos" />
                </Tabs>
            </Box>

            {/* Tab Content */}
            <Box className="flex-1 overflow-auto p-8">
                {/* General */}
                {tabValue === 0 && (
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                        <SectionCard title="Identificación">
                            <InfoRow label="CIF" value={partner.cif} mono />
                            <InfoRow label="NIF / VAT" value={partner.vat_number} mono />
                            <InfoRow label="Tipo" value={typeLabels[partner.type] || partner.type} />
                            <InfoRow label="Rol" value={roleLabels[partner.role] || partner.role} />
                        </SectionCard>

                        <SectionCard title="Contacto">
                            {partner.contact && partner.contact.length > 0 ? (
                                partner.contact.map((c, idx) => (
                                    <Box key={idx} className={idx > 0 ? 'mt-3 pt-3 border-t border-divider' : ''}>
                                        <InfoRow label="Email" value={c.email} />
                                        <InfoRow label="Teléfono" value={c.phone} />
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">Sin contactos registrados</Typography>
                            )}
                        </SectionCard>
                    </Box>
                )}

                {/* Addresses */}
                {tabValue === 1 && (
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                        {partner.address && partner.address.length > 0 ? (
                            partner.address.map((addr, idx) => (
                                <SectionCard key={idx} title={`Dirección ${idx + 1}`}>
                                    <InfoRow label="Calle" value={addr.street} />
                                    <InfoRow label="Ciudad" value={addr.city} />
                                    <InfoRow label="Código Postal" value={addr.postal_code} />
                                    <InfoRow label="Estado" value={addr.state} />
                                    <InfoRow label="País" value={addr.country} />
                                </SectionCard>
                            ))
                        ) : (
                            <Paper variant="outlined" className="p-8 rounded-xl col-span-full flex items-center justify-center">
                                <Typography variant="body1" color="text.secondary">
                                    Sin direcciones registradas
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                )}

                {/* Bank Accounts */}
                {tabValue === 2 && (
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                        {partner.bank_accounts && partner.bank_accounts.length > 0 ? (
                            partner.bank_accounts.map((acc, idx) => (
                                <SectionCard key={idx} title={acc.name || `Cuenta ${idx + 1}`}>
                                    <InfoRow label="Número" value={acc.account_number} mono />
                                    <InfoRow label="SWIFT" value={acc.swift} mono />
                                    <InfoRow label="Titular" value={acc.account_holder} />
                                </SectionCard>
                            ))
                        ) : (
                            <Paper variant="outlined" className="p-8 rounded-xl col-span-full flex items-center justify-center">
                                <Typography variant="body1" color="text.secondary">
                                    Sin cuentas bancarias registradas
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                )}

                {/* Taxes */}
                {tabValue === 3 && (
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                        {showSaleTaxes && (
                            <SectionCard title="Impuestos de Venta">
                                <TaxChips taxes={partner.sale_taxes} color="#4caf50" />
                            </SectionCard>
                        )}
                        {showPurchaseTaxes && (
                            <SectionCard title="Impuestos de Compra">
                                <TaxChips taxes={partner.purchase_taxes} color="#2196f3" />
                            </SectionCard>
                        )}
                        {!showSaleTaxes && !showPurchaseTaxes && (
                            <Paper variant="outlined" className="p-8 rounded-xl col-span-full flex items-center justify-center">
                                <Typography variant="body1" color="text.secondary">
                                    Este tipo de socio no tiene impuestos configurables
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
