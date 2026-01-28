import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { CompanySettingsForm } from '../pages/SettingPage';
import useActiveCompany from '@/features/companies/useActiveCompany';
import useUpdateCompany from '@/features/companies/hooks/useUpdateCompany';

export default function ProfileCompany() {
    const { register, setValue, watch, reset, formState: { isSubmitting } } = useFormContext<CompanySettingsForm>();
    const activeCompany = useActiveCompany();
    const { mutateAsync: updateCompany, isPending } = useUpdateCompany();
    const [isEditing, setIsEditing] = React.useState(false);


    // Watch fields for logic and previews
    const logoFile = watch("logo");
    const faviconFile = watch("favicon");

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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles && acceptedFiles[0];
        if (file) setValue("logo", file, { shouldDirty: true });
    }, [setValue]);

    const onFaviconDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles && acceptedFiles[0];
        if (file) setValue("favicon", file, { shouldDirty: true });
    }, [setValue]);

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Perfil de Empresa
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Información básica e identidad visual
                    </Typography>
                </Box>
                {!isEditing ? (
                    <Button
                        className="btn-primary"
                        variant="outlined"
                        size="large"
                        startIcon={<FuseSvgIcon size={16}>heroicons-outline:pencil</FuseSvgIcon>}
                        onClick={handleEdit}
                    >
                        Editar
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                    </Box>
                )}
            </Box>

            <Box sx={{ display: "flex", gap: 3 }}>
                {/* Left: Form */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                            Nombre de la Empresa
                        </Typography>
                        <TextField
                            {...register("name")}
                            fullWidth
                            size="small"
                            sx={{ mt: 1 }}
                            disabled={!isEditing}
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                            CIF / NIF
                        </Typography>
                        <TextField
                            {...register("cif")}
                            placeholder="Ej: A12345678"
                            fullWidth
                            size="small"
                            sx={{ mt: 1 }}
                            disabled={!isEditing}
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                            URL de la Empresa
                        </Typography>
                        <TextField
                            {...register("website")}
                            fullWidth
                            size="small"
                            sx={{ mt: 1 }}
                            disabled={!isEditing}
                        />
                    </Box>
                </Box>

                {/* Right: Dropzones */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                    }}
                >
                    {/* Logo Dropzone */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            flex: 1,
                        }}
                    >
                        <input {...getInputProps()} />
                        <Box
                            sx={{
                                border: "2px dashed #1976d2",
                                borderRadius: 1,
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                bgcolor: isDragActive ? "#f5f5f5" : "white",
                                transition: "all 0.3s ease",
                                minHeight: "140px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 1,
                                pointerEvents: "auto",
                                "&:hover": {
                                    bgcolor: "primary.50",
                                    borderColor: "primary.dark",
                                },
                            }}
                        >
                            {currentLogo ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <img
                                        src={currentLogo}
                                        alt="Logo"
                                        style={{
                                            maxWidth: "90%",
                                            maxHeight: "80px",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setValue("logo", null, { shouldDirty: true });
                                            setLogoPreview(null);
                                        }}
                                    >
                                        {logoFile ? "Eliminar Nuevo" : "Eliminar Actual (No implementado)"}
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <FuseSvgIcon
                                        sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                                    >
                                        lucide:upload-cloud
                                    </FuseSvgIcon>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600, color: "text.primary" }}
                                    >
                                        Logo Principal
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        Arrastra o haz clic
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>

                    {/* Favicon Dropzone */}
                    <Box
                        {...getRootPropsIcon()}
                        sx={{
                            flex: 1,
                        }}
                    >
                        <input {...getInputPropsIcon()} />
                        <Box
                            sx={{
                                border: "2px dashed #1976d2",
                                borderRadius: 1,
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                bgcolor: isDragActiveIcon ? "#f5f5f5" : "white",
                                transition: "all 0.3s ease",
                                minHeight: "140px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 1,
                                pointerEvents: "auto",
                                "&:hover": {
                                    bgcolor: "primary.50",
                                    borderColor: "primary.dark",
                                },
                            }}
                        >
                            {currentFavicon ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <img
                                        src={currentFavicon}
                                        alt="Favicon"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setValue("favicon", null, { shouldDirty: true });
                                            setFaviconPreview(null);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <FuseSvgIcon
                                        sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                                    >
                                        lucide:favicon
                                    </FuseSvgIcon>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600, color: "text.primary" }}
                                    >
                                        Favicon
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        Arrastra o haz clic
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
