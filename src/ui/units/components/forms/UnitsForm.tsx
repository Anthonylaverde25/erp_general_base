import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Box, Typography, Divider, Stack, Fade, Autocomplete, CircularProgress } from "@mui/material";
import { Save, Close } from "@mui/icons-material";

import { unitSchema, UnitFormType } from "@/schemas/units/units.schema";
import { defaultCreateUnitValues, defaultUpdateUnitValues } from "@/schemas/units/units.defaults";
import { UnitEntity } from "@/domain/entities/units/UnitEntity";
import { CreateUnitDTO, UpdateUnitDTO } from "@/domain/entities/units/DTOs/UnitDTOs";
import { useCreateUnit } from "@/features/units/hooks/useCreateUnit";
import { useUpdateUnit } from "@/features/units/hooks/useUpdateUnit";
import { useIndexUnitTypes } from "@/features/unit_types/hooks/useIndexUnitTypes";

interface UnitsFormProps {
    mode: 'create' | 'edit';
    data?: UnitEntity | null;
    onCancel: () => void;
    onSuccess?: () => void;
}

export function UnitsForm({ mode, data, onCancel, onSuccess }: UnitsFormProps) {
    const createUnit = useCreateUnit();
    const updateUnit = useUpdateUnit();
    const { unitTypes, isLoading: isLoadingUnitTypes } = useIndexUnitTypes();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<UnitFormType>({
        mode: "onChange",
        resolver: zodResolver(unitSchema),
        defaultValues: defaultCreateUnitValues,
    });

    useEffect(() => {
        if (data && mode === 'edit') {
            reset(defaultUpdateUnitValues(data));
        } else {
            reset(defaultCreateUnitValues);
        }
    }, [data, mode, reset]);

    const onSubmit = (values: UnitFormType) => {
        if (mode === 'edit' && data) {
            const updateData: UpdateUnitDTO = {
                unit_type_id: values.unit_type_id,
                code: values.code,
                name: values.name,
            };
            updateUnit.mutate(
                { id: data.id, data: updateData },
                {
                    onSuccess: () => {
                        onSuccess?.();
                        onCancel();
                    },
                }
            );
        } else {
            const createData: CreateUnitDTO = {
                unit_type_id: values.unit_type_id,
                code: values.code,
                name: values.name,
            };
            createUnit.mutate(createData, {
                onSuccess: () => {
                    onSuccess?.();
                    onCancel();
                },
            });
        }
    };

    const isLoading = createUnit.isPending || updateUnit.isPending;

    const title = mode === 'create' ? "Create Unit" : "Edit Unit";
    const subtitle = mode === 'create' ? "Enter details for the new unit." : "Update the unit information.";

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
                        name="unit_type_id"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                                options={unitTypes || []}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={unitTypes?.find((ut) => ut.id === value) || null}
                                onChange={(_, newValue) => {
                                    onChange(newValue ? newValue.id : 0);
                                }}
                                loading={isLoadingUnitTypes}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Unit Type"
                                        variant="filled"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoadingUnitTypes ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        )}
                    />

                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Code"
                                placeholder="e.g. m, kg"
                                variant="filled"
                                fullWidth
                                error={!!errors.code}
                                helperText={errors.code?.message}
                                disabled={isLoading}
                            />
                        )}
                    />

                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                placeholder="e.g. Meter, Kilogram"
                                variant="filled"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={isLoading}
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
