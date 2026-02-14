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
                    px: 3,
                    pt: 2,
                    pb: 2,
                    background: `linear-gradient(180deg, ${alpha(accentColor, 0.08)}, transparent)`
                }}
            >
                {/* Top bar */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <PageBreadcrumb />
                </Box>

                {/* Identity row */}
                <Stack direction="row" spacing={2} alignItems="center" mt={2}>


                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha(accentColor, 0.15),
                            color: accentColor,
                            fontSize: 28,
                            fontWeight: 700
                        }}
                    >
                        {typeIcons[partner.type] || typeIcons['company']}
                    </Avatar>

                    <Box className='flex w-full justify-between'>
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ lineHeight: 1.1 }}
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

                            <Stack className='' direction="row" spacing={1} mt={1}>
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

                        <Box className='flex items-center gap-2'>
                            <PartnerCreateActionMenu />
                            <Tooltip title="Copiar ID">
                                <IconButton>
                                    <ContentCopy fontSize="medium" />
                                </IconButton>
                            </Tooltip>

                            <IconButton>
                                <MoreVert fontSize="medium" />
                            </IconButton>
                        </Box>


                    </Box>
                </Stack>
            </Box>

            {/* <Divider /> */}

            <Box className='flex items-center gap-2 px-3 pb-3'>
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
