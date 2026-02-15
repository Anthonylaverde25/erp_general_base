import {
    Box,
    Typography,
    Chip,
    Button,
    Stack,
    IconButton,
    Avatar,
    alpha,
    useTheme,
    Divider,
    Tooltip
} from '@mui/material';
import {
    ArrowBack,
    ContentCopy,
    MoreVert,
    Description,
    RequestQuote,
    NoteAdd,
    PointOfSale,
    ShoppingCart
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import { roleLabels, typeLabels, typeIcons, roleColors } from './PartnerProfileShared';
import PartnerCreateActionMenu from './PartnerCreateActionMenu';

interface PartnerProfileHeaderProps {
    partner: PartnerEntity;
    tabValue: number;
    onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function PartnerProfileHeader({ partner, tabValue, onTabChange }: PartnerProfileHeaderProps) {
    const navigate = useNavigate();
    const theme = useTheme();

    const name = partner.name || 'Sin nombre';
    const accentColor = roleColors[partner.role] || theme.palette.primary.main;

    return (
        <Box
            sx={{
                width: '100%',
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}
        >
            {/* HEADER ZONE */}
            <Box
                sx={{
                    px: { xs: 2, md: 3 },
                    pt: { xs: 2, md: 2 },
                    pb: { xs: 2, md: 2 },
                    background: `linear-gradient(180deg, ${alpha(accentColor, 0.08)}, transparent)`
                }}
            >
                {/* Top bar */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <PageBreadcrumb />
                </Box>

                {/* Identity row */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}>

                    <Avatar
                        sx={{
                            width: { xs: 48, sm: 56 },
                            height: { xs: 48, sm: 56 },
                            bgcolor: alpha(accentColor, 0.15),
                            color: accentColor,
                            fontSize: { xs: 24, sm: 28 },
                            fontWeight: 700
                        }}
                    >
                        {typeIcons[partner.type] || typeIcons['company']}
                    </Avatar>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ lineHeight: 1.1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                            >
                                {name}
                            </Typography>

                            {partner.comercial_name && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {partner.comercial_name}
                                </Typography>
                            )}

                            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
                                <Chip
                                    label={roleLabels[partner.role] || partner.role}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(accentColor, 0.12),
                                        color: accentColor,
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

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                            <PartnerCreateActionMenu />
                            <Tooltip title="Copiar ID">
                                <IconButton size="small">
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <IconButton size="small">
                                <MoreVert fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* <Divider /> */}

            <Box className='flex items-center gap-2 px-3 pb-3' sx={{ flexWrap: 'wrap' }}>
                {['Resumen', 'Impuestos', 'Archivos'].map((label, index) => {
                    const isActive = tabValue === index;
                    return (
                        <Button
                            key={label}
                            onClick={(e) => onTabChange(e, index)}
                            size="small"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: isActive ? '#ffffff' : 'text.secondary',
                                py: 0.5,
                                px: 1.5,
                                borderRadius: 0.5,
                                border: '1px solid',
                                borderColor: isActive ? '#1b1b1b' : 'divider',
                                bgcolor: isActive ? '#1b1b1b' : 'transparent',
                                '&:hover': {
                                    bgcolor: isActive ? '#333333' : 'action.hover',
                                    color: isActive ? '#ffffff' : 'text.primary',
                                    borderColor: isActive ? '#1b1b1b' : 'divider'
                                }
                            }}
                        >
                            {label}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
}
