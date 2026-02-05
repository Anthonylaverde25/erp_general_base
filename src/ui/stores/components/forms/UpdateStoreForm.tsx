import React, { useEffect } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import {
    TextField,
    Button,
    Box,
    Typography,
    Divider,
    Stack,
    Fade,
} from "@mui/material";
import { Store, Save, Close, LocationOn } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateStore from "@/features/stores/hooks/useUpdateStore";
import useShowStore from "@/features/stores/hooks/useShowStore";
import {
    UpdateStoreFormType,
    updateStoreSchema,
    defaultUpdateStoreValues,
} from "@/schemas/store/store.schema";
import StoreAddressCard from "./StoreAddressCard";
import StoreAddressModal from "./StoreAddressModal";
import { useState } from "react";

interface UpdateStoreFormProps {
    storeId: number;
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function UpdateStoreForm({
    storeId,
    onCancel,
    onSuccess,
}: UpdateStoreFormProps) {
    const { handleUpdateStore, isLoading } = useUpdateStore();
    const { store, isLoading: isLoadingStore } =
        useShowStore(storeId);

    const [addressModalOpen, setAddressModalOpen] = useState(false);

    const methods = useForm<UpdateStoreFormType>({
        mode: "onChange",
        resolver: zodResolver(updateStoreSchema),
        defaultValues: defaultUpdateStoreValues(),
    });

    const { control, formState, handleSubmit, reset, watch, setValue } = methods;
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

    useEffect(() => {
        if (store) {
            reset(defaultUpdateStoreValues(store));
        }
    }, [store, reset]);

    const onSubmit = async (data: UpdateStoreFormType) => {
        try {
            await handleUpdateStore({ id: storeId, data });
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

    if (isLoadingStore) {
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="text.secondary">Cargando...</Typography>
            </Box>
        );
    }

    return (
        <Fade in timeout={400}>
            <Box>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
                            {/* Header */}
                            <Box>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Actualizar tienda
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Modifique la información de la tienda
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
                                                    address={addressValues as any}
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
                                    Actualizar tienda
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </FormProvider>
            </Box>
        </Fade>
    );
}
