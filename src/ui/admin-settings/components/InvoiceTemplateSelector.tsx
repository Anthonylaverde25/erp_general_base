import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useFormContext } from 'react-hook-form';
import SectionHeader from './SectionHeader';
import { CompanySettingsForm } from '../pages/SettingPage';

export default function InvoiceTemplateSelector() {
    const { setValue, watch } = useFormContext<CompanySettingsForm>();
    const designType = watch("design_type");

    return (
        <Box>
            <SectionHeader title="Plantilla de Factura" subtitle="Selecciona el diseño para tus facturas PDF" />

            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                {/* Professional Template */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                        onClick={() => setValue("design_type", "professional")}
                        sx={{
                            border: 2,
                            borderColor: designType === "professional" ? 'primary.main' : 'transparent',
                            borderRadius: 1.5,
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            bgcolor: 'background.paper',
                            boxShadow: designType === "professional" ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }
                        }}
                    >
                        {/* Preview */}
                        <Box
                            sx={{
                                width: '100%',
                                height: 180,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                                <Box sx={{ textAlign: 'right' }}>
                                    <Box sx={{ height: 6, width: 60, bgcolor: 'grey.300', borderRadius: 0.5, mb: 0.5 }} />
                                    <Box sx={{ height: 5, width: 50, bgcolor: 'grey.200', borderRadius: 0.5 }} />
                                </Box>
                            </Box>
                            <Box sx={{ mt: 'auto' }}>
                                <Box sx={{ height: 4, width: '100%', bgcolor: 'grey.200', borderRadius: 0.5, mb: 0.5 }} />
                                <Box sx={{ height: 4, width: '85%', bgcolor: 'grey.200', borderRadius: 0.5, mb: 0.5 }} />
                                <Box sx={{ height: 4, width: '70%', bgcolor: 'grey.200', borderRadius: 0.5 }} />
                            </Box>
                            <Box sx={{ mt: 1, height: 6, width: 45, bgcolor: 'primary.light', borderRadius: 0.5, ml: 'auto' }} />
                        </Box>

                        {/* Template Info */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: designType === 'professional' ? 'primary.main' : 'text.primary', mb: 0.5 }}>
                                Professional
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Modern layout with company branding
                            </Typography>
                        </Box>

                        {/* Selected Badge */}
                        {designType === "professional" && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.7rem',
                                    fontWeight: 600
                                }}
                            >
                                ACTIVE
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Classic Template */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                        onClick={() => setValue("design_type", "classic")}
                        sx={{
                            border: 2,
                            borderColor: designType === "classic" ? 'primary.main' : 'transparent',
                            borderRadius: 1.5,
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            bgcolor: 'background.paper',
                            boxShadow: designType === "classic" ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                            '&:hover': {
                                borderColor: designType === "classic" ? 'primary.main' : 'primary.light',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }
                        }}
                    >
                        {/* Preview */}
                        <Box
                            sx={{
                                width: '100%',
                                height: 180,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 35, height: 35, bgcolor: 'grey.400', borderRadius: '50%' }} />
                                <Box sx={{ height: 5, width: 50, bgcolor: 'grey.300', borderRadius: 0.5 }} />
                            </Box>
                            <Box sx={{ mt: 1 }}>
                                <Box sx={{ height: 4, width: '100%', bgcolor: 'grey.200', borderRadius: 0.5, mb: 0.5 }} />
                                <Box sx={{ height: 4, width: '100%', bgcolor: 'grey.200', borderRadius: 0.5, mb: 0.5 }} />
                                <Box sx={{ height: 4, width: '90%', bgcolor: 'grey.200', borderRadius: 0.5 }} />
                            </Box>
                            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ height: 6, width: 40, bgcolor: 'grey.300', borderRadius: 0.5 }} />
                                <Box sx={{ height: 6, width: 40, bgcolor: 'grey.300', borderRadius: 0.5 }} />
                            </Box>
                        </Box>

                        {/* Template Info */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: designType === 'classic' ? 'primary.main' : 'text.primary', mb: 0.5 }}>
                                Classic
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Traditional centered design
                            </Typography>
                        </Box>
                        {designType === "classic" && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.7rem',
                                    fontWeight: 600
                                }}
                            >
                                ACTIVE
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Minimal Template */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                        onClick={() => setValue("design_type", "minimal")}
                        sx={{
                            border: 2,
                            borderColor: designType === "minimal" ? 'primary.main' : 'transparent',
                            borderRadius: 1.5,
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            bgcolor: 'background.paper',
                            boxShadow: designType === "minimal" ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                            '&:hover': {
                                borderColor: designType === "minimal" ? 'primary.main' : 'primary.light',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }
                        }}
                    >
                        {/* Preview */}
                        <Box
                            sx={{
                                width: '100%',
                                height: 180,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: 1,
                                borderColor: 'divider',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ height: 5, width: 50, bgcolor: 'grey.400', borderRadius: 0.5 }} />
                                <Box sx={{ height: 5, width: 35, bgcolor: 'grey.300', borderRadius: 0.5 }} />
                            </Box>
                            <Box sx={{ borderTop: 1, borderColor: 'grey.300', pt: 1 }}>
                                <Box sx={{ height: 4, width: '100%', bgcolor: 'grey.200', borderRadius: 0.5, mb: 0.5 }} />
                                <Box sx={{ height: 4, width: '75%', bgcolor: 'grey.200', borderRadius: 0.5 }} />
                            </Box>
                            <Box sx={{ mt: 'auto', pt: 1, borderTop: 1, borderColor: 'grey.300' }}>
                                <Box sx={{ height: 5, width: 45, bgcolor: 'grey.400', borderRadius: 0.5, ml: 'auto' }} />
                            </Box>
                        </Box>

                        {/* Template Info */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: designType === 'minimal' ? 'primary.main' : 'text.primary', mb: 0.5 }}>
                                Minimal
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Clean and simple layout
                            </Typography>
                        </Box>
                        {designType === "minimal" && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.7rem',
                                    fontWeight: 600
                                }}
                            >
                                ACTIVE
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
