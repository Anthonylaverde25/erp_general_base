import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Box, Typography, Divider, Stack, Fade, Switch, FormControlLabel } from "@mui/material";
import { Save, Close } from "@mui/icons-material";

import { unitTypeSchema, UnitTypeFormType } from "@/schemas/unit_types/unit_types.schema";
import { defaultCreateUnitTypeValues, defaultUpdateUnitTypeValues } from "@/schemas/unit_types/unit_types.defaults";
import { UnitTypeEntity } from "@/domain/entities/unit_types/UnitTypeEntity";
import { CreateUnitTypeDTO } from "@/domain/entities/unit_types/DTOs/UnitTypeDTOs";
import { useCreateUnitType } from "@/features/unit_types/hooks/useCreateUnitType";
import { useUpdateUnitType } from "@/features/unit_types/hooks/useUpdateUnitType";

interface UnitTypesFormProps {
    mode: 'create' | 'edit';
    data?: UnitTypeEntity | null;
    onCancel: () => void;
    onSuccess?: () => void;
}

export function UnitTypesForm({ mode, data, onCancel, onSuccess }: UnitTypesFormProps) {
    const createUnitType = useCreateUnitType();
    const updateUnitType = useUpdateUnitType();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<UnitTypeFormType>({
        mode: "onChange",
        resolver: zodResolver(unitTypeSchema),
        defaultValues: defaultCreateUnitTypeValues,
    });

    useEffect(() => {
        if (data && mode === 'edit') {
            reset(defaultUpdateUnitTypeValues(data));
        } else {
            reset(defaultCreateUnitTypeValues);
        }
    }, [data, mode, reset]);

    const onSubmit = (values: UnitTypeFormType) => {
        if (mode === 'edit' && data) {
            updateUnitType.mutate(
                { id: data.id, data: values },
                {
                    onSuccess: () => {
                        onSuccess?.();
                        onCancel();
                    },
                }
            );
        } else {
            const createData: CreateUnitTypeDTO = {
                name: values.name,
                description: values.description,
                applicability: values.applicability,
                is_active: values.is_active,
            };
            createUnitType.mutate(createData, {
                onSuccess: () => {
                    onSuccess?.();
                    onCancel();
                },
            });
        }
    };

    const isLoading = createUnitType.isPending || updateUnitType.isPending;

    const title = mode === 'create' ? "Create Unit Type" : "Edit Unit Type";
    const subtitle = mode === 'create' ? "Enter details for the new unit type." : "Update the unit type information.";

    return (
        <Fade in={true}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                </Box>

                <Divider />

                <Stack spacing={3}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                placeholder="e.g. Length, Weight"
                                variant="filled"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={isLoading}
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Description"
                                placeholder="Description of the unit type"
                                variant="filled"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                disabled={isLoading}
                                value={field.value || ""}
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
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        disabled={isLoading}
                                    />
                                }
                                label="Active"
                            />
                        )}
                    />
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={onCancel}
                        disabled={isLoading}
                        startIcon={<Close />}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid || isLoading}
                        startIcon={<Save />}
                    >
                        {mode === 'edit' ? "Update" : "Create"}
                    </Button>
                </Stack>
            </form>
        </Fade>
    );
}
