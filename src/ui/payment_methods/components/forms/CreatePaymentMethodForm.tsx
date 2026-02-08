import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    TextField,
    Button,
    Box,
    Typography,
    Divider,
    Stack,
    Fade,
    MenuItem,
} from "@mui/material";
import { Payment, Save, Close } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreatePaymentMethod from "@/features/payment_methods/hooks/useCreatePaymentMethod";
import {
    CreatePaymentMethodFormType,
    createPaymentMethodSchema,
} from "@/schemas/payment_method/payment_method.schema";
import { defaultCreatePaymentMethodValues } from "@/schemas/payment_method/payment_method.defaults";
import { PAYMENT_TYPES } from "../../constants/paymentTypes";

interface CreatePaymentMethodFormProps {
    onCancel: () => void;
    onSuccess?: () => void;
}



export default function CreatePaymentMethodForm({
    onCancel,
    onSuccess,
}: CreatePaymentMethodFormProps) {
    const { handleCreatePaymentMethod, isLoading } = useCreatePaymentMethod();

    const { control, formState, handleSubmit } =
        useForm<CreatePaymentMethodFormType>({
            mode: "onChange",
            resolver: zodResolver(createPaymentMethodSchema),
            defaultValues: defaultCreatePaymentMethodValues,
        });

    const { errors, isValid } = formState;

    const onSubmit = async (data: CreatePaymentMethodFormType) => {
        try {
            await handleCreatePaymentMethod(data as any);
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                        {/* Header */}
                        <Box>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Crear nuevo método de pago
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Complete la información para registrar un nuevo método de pago
                                en el sistema
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Información del método de pago */}
                        <Box>
                            <SectionTitle
                                icon={Payment}
                                title="Información del método de pago"
                            />

                            <Stack spacing={3}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nombre del método"
                                            placeholder="Ej: Efectivo, Tarjeta Principal"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            fullWidth
                                            variant="filled"
                                        />
                                    )}
                                />

                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Tipo de método"
                                            error={!!errors.type}
                                            helperText={errors.type?.message}
                                            fullWidth
                                            variant="filled"
                                        >
                                            {PAYMENT_TYPES.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Descripción (opcional)"
                                            placeholder="Descripción del método de pago"
                                            error={!!errors.description}
                                            helperText={errors.description?.message}
                                            fullWidth
                                            variant="filled"
                                            multiline
                                            rows={3}
                                        />
                                    )}
                                />
                            </Stack>
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
                                Crear método
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Box>
        </Fade>
    );
}
