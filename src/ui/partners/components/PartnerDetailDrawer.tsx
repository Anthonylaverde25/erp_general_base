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
    alpha
} from '@mui/material';
import {
    Close,
    OpenInNew,
    Email,
    Phone,
    Language,
    LocationOn,
    AccountBalance,
    Receipt
} from '@mui/icons-material';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { PartnerTax } from '@/domain/entities/partners/DTOs/PartnerDTOs';

interface PartnerDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    partner: PartnerEntity | null;
}

const DRAWER_WIDTH = 420;

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

interface DetailRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
    return (
        <Box className="flex items-start gap-3 py-2">
            <Box className="text-gray-400 mt-0.5">{icon}</Box>
            <Box className="flex-1 min-w-0">
                <Typography variant="caption" color="text.secondary" className="uppercase tracking-wider font-medium">
                    {label}
                </Typography>
                <Typography variant="body2" className="mt-0.5">
                    {value || <span className="text-gray-400">—</span>}
                </Typography>
            </Box>
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

export default function PartnerDetailDrawer({ open, onClose, partner }: PartnerDetailDrawerProps) {
    const navigate = useNavigate();

    if (!partner) return null;

    const name = partner.name || 'Sin nombre';
    const defaultAddress = partner.address && partner.address.length > 0 ? partner.address[0] : null;
    const defaultContact = partner.contact && partner.contact.length > 0 ? partner.contact[0] : null;
    const defaultBank = partner.bank_accounts && partner.bank_accounts.length > 0 ? partner.bank_accounts[0] : null;

    const showSaleTaxes = partner.role === 'client' || partner.role === 'client_supplier';
    const showPurchaseTaxes = partner.role === 'supplier' || partner.role === 'client_supplier';

    const handleGoToProfile = () => {
        navigate(`/partners/${partner.id}`);
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: DRAWER_WIDTH,
                    maxWidth: '100vw',
                    bgcolor: 'background.default'
                }
            }}
        >
            {/* Header */}
            <Box
                className="relative p-6 pb-4"
                sx={{
                    background: (theme) =>
                        `linear-gradient(135deg, ${alpha(roleColors[partner.role] || '#666', 0.15)} 0%, ${alpha(
                            roleColors[partner.role] || '#666',
                            0.05
                        )} 100%)`,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box className="flex items-center justify-between mb-4">
                    <Tooltip title="Ver Perfil Completo">
                        <IconButton size="small" onClick={handleGoToProfile} color="primary">
                            <OpenInNew fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <IconButton size="small" onClick={onClose}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                <Box className="flex items-center gap-4">
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: stringToColor(name),
                            fontSize: '1.25rem',
                            fontWeight: 700
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>
                    <Box className="flex-1 min-w-0">
                        <Typography variant="h6" fontWeight={700} className="truncate">
                            {name}
                        </Typography>
                        {partner.comercial_name && (
                            <Typography variant="body2" color="text.secondary" className="truncate">
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
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                }}
                            />
                            <Chip
                                label={typeLabels[partner.type] || partner.type}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                            />
                        </Stack>
                    </Box>
                </Box>
            </Box>

            {/* Body */}
            <Box className="flex-1 overflow-y-auto">
                {/* Identification */}
                <Box className="px-6 py-4">
                    <Typography variant="overline" color="text.secondary" fontWeight={700} className="tracking-widest">
                        Identificación
                    </Typography>
                    <Box className="mt-2">
                        <DetailRow icon={<Receipt fontSize="small" />} label="CIF" value={partner.cif} />
                        <DetailRow icon={<Receipt fontSize="small" />} label="NIF / VAT" value={partner.vat_number} />
                    </Box>
                </Box>

                <Divider />

                {/* Contact */}
                <Box className="px-6 py-4">
                    <Typography variant="overline" color="text.secondary" fontWeight={700} className="tracking-widest">
                        Contacto
                    </Typography>
                    <Box className="mt-2">
                        <DetailRow
                            icon={<Email fontSize="small" />}
                            label="Email"
                            value={defaultContact?.email || ''}
                        />
                        <DetailRow
                            icon={<Phone fontSize="small" />}
                            label="Teléfono"
                            value={defaultContact?.phone || ''}
                        />
                        <DetailRow
                            icon={<Language fontSize="small" />}
                            label="Sitio Web"
                            value={partner.toPlainObject ? '' : ''}
                        />
                    </Box>
                </Box>

                <Divider />

                {/* Address */}
                {defaultAddress && (
                    <>
                        <Box className="px-6 py-4">
                            <Typography variant="overline" color="text.secondary" fontWeight={700} className="tracking-widest">
                                Dirección
                            </Typography>
                            <Box className="mt-2">
                                <DetailRow
                                    icon={<LocationOn fontSize="small" />}
                                    label="Dirección Principal"
                                    value={
                                        <Box>
                                            <Typography variant="body2">{defaultAddress.street}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {defaultAddress.city} {defaultAddress.postal_code}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {defaultAddress.state}, {defaultAddress.country}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                        </Box>
                        <Divider />
                    </>
                )}

                {/* Taxes */}
                {(showSaleTaxes || showPurchaseTaxes) && (
                    <>
                        <Box className="px-6 py-4">
                            <Typography variant="overline" color="text.secondary" fontWeight={700} className="tracking-widest">
                                Impuestos
                            </Typography>
                            <Box className="mt-3 space-y-4">
                                {showSaleTaxes && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" className="uppercase tracking-wider font-medium mb-1.5 block">
                                            Impuestos de Venta
                                        </Typography>
                                        <TaxChips taxes={partner.sale_taxes} color="#4caf50" />
                                    </Box>
                                )}
                                {showPurchaseTaxes && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" className="uppercase tracking-wider font-medium mb-1.5 block">
                                            Impuestos de Compra
                                        </Typography>
                                        <TaxChips taxes={partner.purchase_taxes} color="#2196f3" />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Divider />
                    </>
                )}

                {/* Bank Accounts */}
                {defaultBank && (
                    <Box className="px-6 py-4">
                        <Typography variant="overline" color="text.secondary" fontWeight={700} className="tracking-widest">
                            Cuenta Bancaria
                        </Typography>
                        <Box className="mt-2">
                            <DetailRow
                                icon={<AccountBalance fontSize="small" />}
                                label={defaultBank.name || 'Cuenta Principal'}
                                value={
                                    <Box>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {defaultBank.account_number}
                                        </Typography>
                                        {defaultBank.swift && (
                                            <Typography variant="caption" color="text.secondary">
                                                SWIFT: {defaultBank.swift}
                                            </Typography>
                                        )}
                                        {defaultBank.account_holder && (
                                            <Typography variant="caption" color="text.secondary" className="block">
                                                Titular: {defaultBank.account_holder}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
}
