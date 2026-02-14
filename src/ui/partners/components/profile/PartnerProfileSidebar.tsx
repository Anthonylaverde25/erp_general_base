
import {
    Box,
    Typography,
    Stack,
    Button,
    Divider,
    Link as MuiLink,
    Avatar,
    Chip
} from '@mui/material';
import {

    Edit,
    WhatsApp,
    Mail,
    Phone,
    LocationOn,
    Add,
    Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { SectionTitle } from './PartnerProfileShared';

interface PartnerProfileSidebarProps {
    partner: PartnerEntity;
}

export default function PartnerProfileSidebar({ partner }: PartnerProfileSidebarProps) {
    const navigate = useNavigate();
    const defaultContact = partner.contact?.find(c => c.default) || (partner.contact?.[0] ?? null);
    const defaultAddress = partner.address?.find(a => a.default) || (partner.address?.[0] ?? null);

    return (
        <Box
            sx={{
                width: 400,
                flexShrink: 0,
                borderRight: 1,
                borderColor: 'divider',
                p: 3,
                overflowY: 'auto'
            }}
        >


            {/* Quick Actions */}
            <Box className="flex flex-wrap gap-2 mb-4">
                <Button
                    size="small"
                    startIcon={<Edit sx={{ fontSize: 16 }} />}
                    onClick={() => navigate(`/partners/${partner.id}/edit`)}
                    sx={{ flex: '1 1 auto', textTransform: 'none', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary', borderRadius: 0.5, py: 0.5, border: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
                >
                    Editar
                </Button>
                <Button
                    size="small"
                    startIcon={<WhatsApp sx={{ fontSize: 16 }} />}
                    disabled={!defaultContact?.phone}
                    onClick={() => {
                        if (defaultContact?.phone) {
                            window.open(`https://wa.me/${defaultContact.phone.replace(/\D/g, '')}`, '_blank');
                        }
                    }}
                    sx={{ flex: '1 1 auto', textTransform: 'none', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary', borderRadius: 0.5, py: 0.5, border: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
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
                    sx={{ flex: '1 1 auto', textTransform: 'none', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary', borderRadius: 0.5, py: 0.5, border: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
                >
                    Email
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
                    sx={{ flex: '1 1 auto', textTransform: 'none', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem', color: 'text.primary', borderRadius: 0.5, py: 0.5, border: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' } }}
                >
                    Llamar
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Contacto principal */}
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
                <Button
                    size="small"
                    startIcon={<Add sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', p: 0, minWidth: 0, fontSize: '0.8rem', fontWeight: 600, color: 'primary.main' }}
                >
                    Añadir contacto
                </Button>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Dirección */}
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
                        <Button
                            size="small"
                            sx={{ textTransform: 'none', mt: 0.5, p: 0, minWidth: 0, fontSize: '0.75rem', fontWeight: 600 }}
                            onClick={() => {
                                const q = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.country}`;
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');
                            }}
                        >
                            Ver en mapa
                        </Button>
                    </Box>
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
            <Box className="flex items-start gap-3">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'action.selected', color: 'text.secondary', mt: 0.5 }}>
                    <Description sx={{ fontSize: 16 }} />
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: x => x.spacing(0.5, 2), alignItems: 'baseline' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>CIF:</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{partner.cif || '—'}</Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>VAT:</Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{partner.vat_number || '—'}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
