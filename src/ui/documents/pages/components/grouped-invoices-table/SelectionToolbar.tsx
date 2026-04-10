import { Box, Stack, Typography, Button, Divider, alpha } from '@mui/material';
import { FileStack, X, Copy } from 'lucide-react';
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
                position: 'sticky', 
                top: 0, 
                zIndex: 200,
                bgcolor: (theme) => alpha(theme.palette?.background?.paper || '#ffffff', 0.90),
                backdropFilter: 'blur(8px)',
                borderBottom: (theme) => `2px solid ${theme.palette?.primary?.main || SAP_THEME.primary}`,
                boxShadow: (theme) => theme.shadows?.[2] || '0 2px 8px rgba(0,0,0,0.05)',
                mb: 0.5,
                transition: SAP_THEME.transition
            }}
        >
            <Box className="flex flex-col md:flex-row items-center justify-between p-1.5 gap-4">
                <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={4} 
                    divider={<Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto' }} />}
                >
                    <Box>
                        <Typography sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Seleccionados
                        </Typography>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: (theme) => theme.palette?.primary?.main || SAP_THEME.primary, letterSpacing: -0.5, lineHeight: 1 }}>
                            {selectedCount} <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary' }}>{selectedCount === 1 ? 'ÍTÉM' : 'ÍTÉMS'}</Typography>
                        </Typography>
                    </Box>

                    <Box>
                        <Typography sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Importe Acumulado
                        </Typography>
                        <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'text.primary', letterSpacing: -0.5, lineHeight: 1 }}>
                            {formatCurrency(totalAmount)}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="text"
                        onClick={onCancel}
                        sx={{ 
                            textTransform: 'uppercase', 
                            fontWeight: 700, 
                            px: 1.5,
                            fontSize: '0.7rem',
                            letterSpacing: 0.5,
                            color: 'text.secondary',
                            '&:hover': { bgcolor: 'action.hover' } 
                        }}
                        startIcon={<X size={14} />}
                    >
                        Anular
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={onConfirm}
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            px: 2,
                            py: 0.5,
                            borderRadius: '4px',
                            bgcolor: (theme) => theme.palette?.primary?.main || SAP_THEME.primary,
                            color: (theme) => theme.palette?.primary?.contrastText || '#ffffff',
                            fontSize: '0.7rem',
                            letterSpacing: 0.5,
                            '&:hover': {
                                bgcolor: (theme) => theme.palette?.primary?.dark || '#00446a',
                                boxShadow: '0 4px 10px rgba(0, 84, 131, 0.2)'
                            }
                        }}
                        startIcon={<Copy size={16} />}
                    >
                        Generar Factura Agrupada
                    </Button>
                    <Button
                        variant="outlined"
                        disableElevation
                        onClick={onConfirm2}
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            px: 2,
                            py: 0.5,
                            borderRadius: '4px',
                            borderColor: (theme) => theme.palette?.primary?.main || SAP_THEME.primary,
                            color: (theme) => theme.palette?.primary?.main || SAP_THEME.primary,
                            fontSize: '0.7rem',
                            letterSpacing: 0.5,
                            '&:hover': {
                                bgcolor: 'action.hover',
                                borderColor: (theme) => theme.palette?.primary?.main || SAP_THEME.primary,
                            }
                        }}
                        startIcon={<FileStack size={14} />}
                    >
                        Multifacturación
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
