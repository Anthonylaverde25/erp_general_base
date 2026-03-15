import { Box, Stack, Typography, Button, Divider, alpha } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { FileStack, X } from 'lucide-react';
import { SAP_THEME } from './theme';

interface SelectionToolbarProps {
    selectedCount: number;
    totalAmount: number;
    onCancel: () => void;
    onConfirm: () => void;
    onConfirm2: () => void;
}

export default function SelectionToolbar({ selectedCount, totalAmount, onCancel, onConfirm, onConfirm2 }: SelectionToolbarProps) {
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <Box
            sx={{
                position: 'sticky', top: 0, zIndex: 10,
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderBottom: `2px solid ${SAP_THEME.primary}`,
                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)',
                mb: 0.5,
                transition: SAP_THEME.transition
            }}
        >
            <Box className="flex flex-col md:flex-row items-center justify-between p-3 gap-4">
                <Stack direction="row" alignItems="center" spacing={4} divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: SAP_THEME.border, height: 28, my: 'auto' }} />}>
                    <Box>
                        <Typography variant="caption" sx={{ color: SAP_THEME.textSecondary, fontWeight: 700, textTransform: 'uppercase', display: 'block', letterSpacing: 1 }}>
                            Selección
                        </Typography>
                        <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ letterSpacing: -1 }}>
                            {selectedCount} <Typography component="span" variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>{selectedCount === 1 ? 'Ítem' : 'Ítems'}</Typography>
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ color: SAP_THEME.textSecondary, fontWeight: 700, textTransform: 'uppercase', display: 'block', letterSpacing: 1 }}>
                            Importe Acumulado
                        </Typography>
                        <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: -1 }}>
                            {formatCurrency(totalAmount)}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    <Button
                        size="medium"
                        variant="text"
                        color="inherit"
                        onClick={onCancel}
                        sx={{ 
                            textTransform: 'none', 
                            fontWeight: 600, 
                            px: 2,
                            fontSize: '0.85rem',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } 
                        }}
                        startIcon={<X size={18} />}
                    >
                        Cancelar selección
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={onConfirm}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            py: 0.8,
                            borderRadius: '8px',
                            bgcolor: SAP_THEME.primary,
                            fontSize: '0.85rem',
                            letterSpacing: -0.1,
                            boxShadow: `0 4px 12px -2px ${alpha(SAP_THEME.primary, 0.2)}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: '#064280',
                                transform: 'translateY(-1px)',
                                boxShadow: `0 6px 15px -3px ${alpha(SAP_THEME.primary, 0.3)}`,
                            },
                            '&:active': {
                                transform: 'translateY(0px)',
                            }
                        }}
                        startIcon={<FuseSvgIcon size={18}>heroicons-outline:document-duplicate</FuseSvgIcon>}
                    >
                        Generar Factura Agrupada
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={onConfirm2}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            py: 0.8,
                            borderRadius: '8px',
                            bgcolor: '#3b82f6', // blue-500
                            fontSize: '0.85rem',
                            letterSpacing: -0.1,
                            boxShadow: `0 4px 12px -2px ${alpha('#3b82f6', 0.2)}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: '#2563eb', // blue-600
                                transform: 'translateY(-1px)',
                                boxShadow: `0 6px 15px -3px ${alpha('#3b82f6', 0.3)}`,
                            },
                            '&:active': {
                                transform: 'translateY(0px)',
                            }
                        }}
                        startIcon={<FileStack size={18} />}
                    >
                        Generar Facturación Agrupada 2
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
