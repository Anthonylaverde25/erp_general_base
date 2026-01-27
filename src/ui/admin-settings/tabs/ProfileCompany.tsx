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

export default function ProfileCompany() {
    const { register, setValue, watch } = useFormContext<CompanySettingsForm>();
    const activeCompany = useActiveCompany();

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

    return (
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
                    />
                </Box>

                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            mb: 1.5,
                            display: "block",
                            fontSize: "0.95rem",
                        }}
                    >
                        Plantilla de Factura
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            color: "text.secondary",
                            mb: 2,
                            fontSize: "0.85rem",
                        }}
                    >
                        Selecciona el diseño para tus documentos de facturación
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 2,
                        }}
                    >
                        {[
                            {
                                id: "standard",
                                label: "Estándar",
                                description: "Diseño clásico y profesional",
                                icon: "lucide:file-text",
                            },
                            {
                                id: "minimal",
                                label: "Minimalista",
                                description: "Limpio y moderno",
                                icon: "lucide:layout-template",
                            },
                            {
                                id: "large",
                                label: "Logo Grande",
                                description: "Con logo destacado",
                                icon: "lucide:image",
                            },
                        ].map((design) => (
                            <Box
                                key={design.id}
                                onClick={() => setValue("design_type", design.id, { shouldDirty: true })}
                                sx={{
                                    p: 2.5,
                                    border: "2px solid",
                                    borderColor:
                                        designType === design.id
                                            ? "primary.main"
                                            : "divider",
                                    bgcolor: "background.paper",
                                    cursor: "pointer",
                                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                    fontWeight: designType === design.id ? 700 : 500,
                                    textAlign: "center",
                                    borderRadius: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1.2,
                                    "&:hover": {
                                        borderColor: "primary.main",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 56,
                                        height: 56,
                                        borderRadius: 1.25,
                                        bgcolor: "action.selected",
                                    }}
                                >
                                    <FuseSvgIcon
                                        sx={{
                                            fontSize: 32,
                                            color: "primary.main",
                                        }}
                                    >
                                        {design.icon}
                                    </FuseSvgIcon>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: designType === design.id ? 700 : 600,
                                            color: "text.primary",
                                        }}
                                    >
                                        {design.label}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            color: "text.secondary",
                                            mt: 0.5,
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {design.description}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
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
    );
}
