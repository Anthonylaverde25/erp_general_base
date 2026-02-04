import React from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import {
    TextField,
    Button,
    Box,
    Typography,
    Divider,
    Stack,
    Fade,
    FormControlLabel,
    Switch,
} from "@mui/material";
import { Store, Save, Close, LocationOn } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateStore from "@/features/stores/hooks/useCreateStore";
import {
    CreateStoreFormType,
    createStoreSchema,
    defaultCreateStoreValues,
} from "@/schemas/store/store.schema";
import StoreAddressCard from "./StoreAddressCard";
import StoreAddressModal from "./StoreAddressModal";
import { useState } from "react";

interface CreateStoreFormProps {
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function CreateStoreForm({
    onCancel,
    onSuccess,
}: CreateStoreFormProps) {
    const { handleCreateStore, isLoading } = useCreateStore();
    const [addressModalOpen, setAddressModalOpen] = useState(false);

    const methods = useForm<CreateStoreFormType>({
        mode: "onChange",
        resolver: zodResolver(createStoreSchema),
        defaultValues: defaultCreateStoreValues,
    });

    const { control, formState, handleSubmit, watch, setValue } = methods;
    const { errors, isValid } = formState;

    const addressValues = watch("address");
    const hasAddressValues = addressValues && (
        !!addressValues.street ||
        !!addressValues.city ||
        !!addressValues.state ||
        !!addressValues.postal_code ||
        !!addressValues.country
    );

    const handleDeleteAddress = () => {
        setValue("address", {
            street: "",
            street_2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
            default: false,
        }, { shouldValidate: true });
    };

    const onSubmit = async (data: CreateStoreFormType) => {
        try {
            await handleCreateStore(data);
            onSuccess?.();
            onCancel();
        } catch (error) {
            console.error(error);
        }
    };

    const SectionTitle = ({
        icon: Icon,
        title,
    }: {
        icon: React.ElementType;
        title: string;
    }) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Icon fontSize="small" color="primary" />
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {title}
            </Typography>
        </Stack>
    );

    return (
        <Fade in timeout={400}>
            <Box>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
                            {/* Header */}
                            <Box>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Crear nueva tienda
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Complete la información para registrar una nueva tienda
                                    en el sistema
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Información de la tienda */}
                            <Box>
                                <SectionTitle
                                    icon={Store}
                                    title="Información de la tienda"
                                />

                                <Stack spacing={3}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nombre de la tienda"
                                                placeholder="Ej: Sucursal Centro"
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                fullWidth
                                                variant="filled"
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="code"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Código (opcional)"
                                                placeholder="Ej: SUC-001"
                                                error={!!errors.code}
                                                helperText={errors.code?.message}
                                                fullWidth
                                                variant="filled"
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="is_active"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        color="primary"
                                                    />
                                                }
                                                label="Tienda activa"
                                            />
                                        )}
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Dirección */}
                            <Box>
                                <SectionTitle
                                    icon={LocationOn}
                                    title="Dirección de la tienda"
                                />

                                <Box>
                                    {hasAddressValues ? (
                                        <Fade in timeout={400}>
                                            <Box>
                                                <StoreAddressCard
                                                    address={addressValues}
                                                    onEdit={() => setAddressModalOpen(true)}
                                                    onDelete={handleDeleteAddress}
                                                />
                                            </Box>
                                        </Fade>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            startIcon={<LocationOn />}
                                            onClick={() => setAddressModalOpen(true)}
                                            sx={{ borderStyle: 'dashed' }}
                                            fullWidth
                                        >
                                            Agregar dirección
                                        </Button>
                                    )}

                                    <StoreAddressModal
                                        open={addressModalOpen}
                                        onClose={() => setAddressModalOpen(false)}
                                    />
                                </Box>
                            </Box>

                            <Divider />

                            {/* Buttons */}
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                    variant="text"
                                    color="inherit"
                                    startIcon={<Close />}
                                    onClick={onCancel}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                    disabled={!isValid || isLoading}
                                >
                                    Crear tienda
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </FormProvider>
            </Box>
        </Fade>
    );
}
