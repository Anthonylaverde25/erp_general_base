import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { CompanySettingsForm } from '../pages/SettingPage';
import useActiveCompany from '@/features/companies/useActiveCompany';
import useUpdateCompany from '@/features/companies/hooks/useUpdateCompany';

import LocationContactTab from './LocationContactTab';

export default function ProfileCompany() {
    const { register, setValue, watch, reset, formState: { isSubmitting, isDirty } } = useFormContext<CompanySettingsForm>();
    const activeCompany = useActiveCompany();
    const { mutateAsync: updateCompany, isPending } = useUpdateCompany();
    const [isEditing, setIsEditing] = React.useState(false);


    // Watch fields for logic and previews
    const logoFile = watch("logo");
    const faviconFile = watch("favicon");
    const designType = watch("design_type");

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const currentLogo = logoPreview || activeCompany?.logo_url;
    // Favicon might not exist on Company entity yet, so we just use preview
    const currentFavicon = faviconPreview;

    useEffect(() => {
        if (!logoFile) {
            setLogoPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(logoFile);
        setLogoPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [logoFile]);

    useEffect(() => {
        if (!faviconFile) {
            setFaviconPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(faviconFile);
        setFaviconPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [faviconFile]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles && acceptedFiles[0];
        if (file && activeCompany) {
            // Optimistic update
            const objectUrl = URL.createObjectURL(file);
            setLogoPreview(objectUrl);
            setValue("logo", file); // Keep form sync just in case

            try {
                await updateCompany({
                    id: activeCompany.id,
                    data: { logo: file }
                });
            } catch (error) {
                console.error("Failed to upload logo", error);
                setLogoPreview(null); // Revert on error
            }
        }
    }, [activeCompany, updateCompany, setValue]);

    const onFaviconDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles && acceptedFiles[0];
        if (file && activeCompany) {
            // Optimistic update
            const objectUrl = URL.createObjectURL(file);
            setFaviconPreview(objectUrl);
            setValue("favicon", file);

            try {
                await updateCompany({
                    id: activeCompany.id,
                    data: { favicon: file }
                });
            } catch (error) {
                console.error("Failed to upload favicon", error);
                setFaviconPreview(null);
            }
        }
    }, [activeCompany, updateCompany, setValue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
    });

    const {
        getRootProps: getRootPropsIcon,
        getInputProps: getInputPropsIcon,
        isDragActive: isDragActiveIcon,
    } = useDropzone({
        onDrop: onFaviconDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset profile fields to original values
        if (activeCompany) {
            reset({
                name: activeCompany.name || "",
                cif: activeCompany.cif || "",
                website: activeCompany.website || "",
                corporate_color: activeCompany.corporate_color || "#1976d2",
                design_type: "standard",
                logo: null,
                favicon: null,
            }, { keepDefaultValues: true });
        }
    };

    const handleSave = async () => {
        try {
            if (!activeCompany?.id) {
                console.error("No active company");
                return;
            }

            // Get current form values for profile fields
            const formData = {
                name: watch("name"),
                cif: watch("cif"),
                website: watch("website"),
                corporate_color: watch("corporate_color"),
                design_type: watch("design_type"),
                logo: watch("logo"), // File or null
                favicon: watch("favicon"), // File or null
            };

            console.log("Profile data to save:", formData);

            // Call update company mutation
            await updateCompany({
                id: activeCompany.id,
                data: formData,
            });

            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return (
        <Box>
            {/* Section Header with Edit Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {!isEditing && (
                        <Button
                            className="btn-primary"
                            variant="outlined"
                            size="large"
                            startIcon={<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>}
                            onClick={handleEdit}
                        >
                            Editar
                        </Button>
                    )}

                    {!isEditing && isDirty && (
                        <Button
                            className="btn-primary"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>}
                            onClick={handleSave}
                            disabled={isSubmitting}
                        >
                            Guardar
                        </Button>
                    )}

                    {isEditing && (
                        <>
                            <Button
                                className="btn-secondary"
                                variant="outlined"
                                color="secondary"
                                size="large"
                                startIcon={<FuseSvgIcon size={16}>heroicons-outline:x-mark</FuseSvgIcon>}
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="btn-primary"
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>}
                                onClick={handleSave}
                                disabled={isSubmitting}
                            >
                                Guardar
                            </Button>
                        </>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

                {/* 1. SECTION: GENERAL & BRANDING */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                    gap: 6
                }}>

                    {/* LEFT: DETAILS FORM */}
                    <Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Información General
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Detalles básicos de la empresa
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 3
                        }}>
                            <Box sx={{ gridColumn: '1 / -1' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 0.5, display: 'block' }}>
                                    Nombre de la Empresa
                                </Typography>
                                <TextField
                                    {...register("name")}
                                    fullWidth
                                    size="small"
                                    variant="filled"
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 0.5, display: 'block' }}>
                                    CIF / NIF
                                </Typography>
                                <TextField
                                    {...register("cif")}
                                    placeholder="Ej: A12345678"
                                    fullWidth
                                    size="small"
                                    variant="filled"
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 0.5, display: 'block' }}>
                                    URL de la Empresa
                                </Typography>
                                <TextField
                                    {...register("website")}
                                    fullWidth
                                    size="small"
                                    variant="filled"
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Box>

                            <Box sx={{ gridColumn: '1 / -1' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 1, display: 'block' }}>
                                    Color Corporativo
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 1,
                                            bgcolor: watch('corporate_color') || "#1976d2",
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: 1
                                        }}
                                    />
                                    <Box sx={{ flex: 1, maxWidth: 200 }}>
                                        <TextField
                                            {...register("corporate_color")}
                                            type="color"
                                            fullWidth
                                            size="small"
                                            sx={{
                                                "& input[type='color']": {
                                                    height: "48px",
                                                    cursor: "pointer",
                                                    p: 0,
                                                    border: 'none'
                                                },
                                                "& .MuiOutlinedInput-root": { p: 0.5 }
                                            }}
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* RIGHT: BRANDING ASSETS */}
                    <Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Logo y Favicon
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestiona el logo y favicon de tu empresa
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Logo Dropzone */}
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: "2px dashed",
                                    borderColor: isDragActive ? "primary.main" : "divider",
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    bgcolor: isDragActive ? "action.hover" : "background.paper",
                                    transition: "all 0.2s ease",
                                    minHeight: "140px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: 'relative',
                                    "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" }
                                }}
                            >
                                <input {...getInputProps()} />
                                {currentLogo ? (
                                    <>
                                        <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                            <img src={currentLogo} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                                        </Box>
                                        <IconButton
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (activeCompany) {
                                                    setLogoPreview(null);
                                                    setValue("logo", null);
                                                    try {
                                                        await updateCompany({
                                                            id: activeCompany.id,
                                                            data: { logo: null }
                                                        });
                                                    } catch (error) {
                                                        console.error("Failed to delete logo", error);
                                                    }
                                                }
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'background.paper',
                                                boxShadow: 1,
                                                "&:hover": { bgcolor: 'action.hover' }
                                            }}
                                            size="small"
                                        >
                                            <FuseSvgIcon size={16}>heroicons-outline:x-mark</FuseSvgIcon>
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <FuseSvgIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }}>lucide:upload-cloud</FuseSvgIcon>
                                        <Typography variant="body2" fontWeight={600} color="text.primary">Logo</Typography>
                                    </>
                                )}
                            </Box>

                            {/* Favicon Dropzone */}
                            <Box
                                {...getRootPropsIcon()}
                                sx={{
                                    border: "2px dashed",
                                    borderColor: isDragActiveIcon ? "primary.main" : "divider",
                                    borderRadius: 2,
                                    p: 2,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    bgcolor: isDragActiveIcon ? "action.hover" : "background.paper",
                                    transition: "all 0.2s ease",
                                    minHeight: "100px",
                                    display: "flex",
                                    flexDirection: "row", // Horizontal for icon to save space? Or stick to column. Column is fine.
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                    position: 'relative',
                                    "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" }
                                }}
                            >
                                <input {...getInputPropsIcon()} />
                                {currentFavicon ? (
                                    <>
                                        <Box sx={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={currentFavicon} alt="Favicon" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                        </Box>
                                        <IconButton
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (activeCompany) {
                                                    setFaviconPreview(null);
                                                    setValue("favicon", null);
                                                    try {
                                                        await updateCompany({
                                                            id: activeCompany.id,
                                                            data: { favicon: null }
                                                        });
                                                    } catch (error) {
                                                        console.error("Failed to delete favicon", error);
                                                    }
                                                }
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                bgcolor: 'background.paper',
                                                boxShadow: 1,
                                                padding: 0.5,
                                                "&:hover": { bgcolor: 'action.hover' }
                                            }}
                                            size="small"
                                        >
                                            <FuseSvgIcon size={14}>heroicons-outline:x-mark</FuseSvgIcon>
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <FuseSvgIcon sx={{ fontSize: 24, color: "text.secondary" }}>lucide:image</FuseSvgIcon>
                                        <Box textAlign="left">
                                            <Typography variant="body2" fontWeight={600} color="text.primary">Favicon</Typography>
                                            <Typography variant="caption" color="text.secondary">32x32px</Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>


                {/* 2. SECTION: UBICACIÓN Y CONTACTO */}
                <Box>
                    <LocationContactTab />
                </Box>

                {/* 3. SECTION: AJUSTES DE DISEÑO */}
                <Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                            Ajustes de Diseño
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Personaliza los colores y la plantilla de tus documentos
                        </Typography>
                    </Box>

                    {/* Sub-section: ESTILO Y PLANTILLA */}
                    <Box sx={{ display: "grid", gap: 4 }}>


                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 1.5, display: 'block' }}>
                                Plantilla de Factura
                            </Typography>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                                gap: 2
                            }}>
                                {[
                                    { id: "standard", label: "Estándar", description: "Clásico y profesional", icon: "lucide:file-text" },
                                    { id: "minimal", label: "Minimalista", description: "Limpio y simple", icon: "lucide:layout-template" },
                                    { id: "large", label: "Logo Grande", description: "Énfasis en marca", icon: "lucide:image" },
                                ].map((design) => (
                                    <Box
                                        key={design.id}
                                        onClick={() => setValue("design_type", design.id, { shouldDirty: true })}
                                        sx={{
                                            p: 2,
                                            border: "2px solid",
                                            borderColor: designType === design.id ? "primary.main" : "divider",
                                            bgcolor: designType === design.id ? "primary.50" : "background.paper",
                                            cursor: "pointer",
                                            borderRadius: 2,
                                            opacity: 1,
                                            transition: "all 0.2s ease",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 1,
                                            textAlign: "center",
                                            "&:hover": { borderColor: "primary.main", transform: 'translateY(-2px)' }
                                        }}
                                    >
                                        <FuseSvgIcon sx={{ fontSize: 28, color: designType === design.id ? "primary.main" : "text.secondary" }}>
                                            {design.icon}
                                        </FuseSvgIcon>
                                        <Box>
                                            <Typography variant="body2" fontWeight={designType === design.id ? 700 : 600} color={designType === design.id ? "primary.dark" : "text.primary"}>
                                                {design.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                {design.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>


            </Box>
        </Box>
    );
}
