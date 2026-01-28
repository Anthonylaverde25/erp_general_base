import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useFormContext } from 'react-hook-form';
import { CompanySettingsForm } from '../pages/SettingPage';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function PreferencesTab() {
    const { register, watch, setValue, reset, formState: { isSubmitting } } = useFormContext<CompanySettingsForm>();
    const [isEditing, setIsEditing] = React.useState(false);
    const language = watch("preferences.language");
    const numberFormat = watch("preferences.number_format");
    const designType = watch("design_type");

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset preferences fields
        reset(undefined, { keepDefaultValues: true });
    };

    const handleSave = async () => {
        // TODO: Implement API call to save preferences data
        console.log("Saving preferences...");
        setIsEditing(false);
    };

    return (
        <Box>
            {/* Section Header with Edit Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Preferencias
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Configuración de formato y visualización
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

            <Box sx={{ display: "grid", gap: 2 }}>
                <Box>
                    <TextField
                        {...register("preferences.language")}
                        select
                        label="Idioma"
                        value={language || "Español"}
                        fullWidth
                        size="small"
                        defaultValue="Español"
                        disabled={!isEditing}
                    >
                        <MenuItem value="Español">Español</MenuItem>
                        <MenuItem value="Inglés">Inglés</MenuItem>
                    </TextField>
                </Box>
                <Box>
                    <TextField
                        {...register("preferences.number_format")}
                        select
                        label="Formato de número"
                        value={numberFormat || "1,234.56"}
                        fullWidth
                        size="small"
                        defaultValue="1,234.56"
                        disabled={!isEditing}
                    >
                        <MenuItem value="1,234.56">1,234.56</MenuItem>
                        <MenuItem value="1.234,56">1.234,56</MenuItem>
                    </TextField>
                </Box>

                <Box>
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 0.5 }}
                    >
                        Cantidad Máxima de Usuarios
                    </Typography>
                    <TextField
                        {...register("preferences.max_users", { valueAsNumber: true })}
                        type="number"
                        placeholder="Ej: 3"
                        fullWidth
                        size="small"
                        variant="filled"
                        InputProps={{ readOnly: !isEditing }}
                    />
                </Box>


                {/* Invoice Template Section */}
                <Box sx={{ mt: 2 }}>
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
                                    opacity: 1,
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
        </Box>
    );
}
