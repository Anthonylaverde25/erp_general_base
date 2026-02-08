import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Divider,
    Stack,
    Fade,
    FormControlLabel,
    Switch,
    Autocomplete,
    Chip,
} from "@mui/material";
import { Save, Close } from "@mui/icons-material";

import { useCreateFamily } from "@/features/families/hooks/useCreateFamily";
import { useUpdateFamily } from "@/features/families/hooks/useUpdateFamily";
import { useShowFamily } from "@/features/families/hooks/useShowFamily";
import { FamilyEntity } from "@/domain/entities/families/FamilyEntity";
import { useIndexTaxRates } from "@/features/tax_rates/hooks/useIndexTaxRates";
import { CreateFamilyDTO } from "@/domain/entities/families/DTOs/FamilyDTOs";

// Schema definition
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    tax_rate_ids: z.array(z.coerce.number()).min(1, {
        message: "At least one Tax Rate is required.",
    }),
    percentage: z.coerce.number().min(0, {
        message: "Percentage must be positive.",
    }),
    // is_active removed from schema input
});

type FormValues = z.infer<typeof formSchema>;

interface FamiliesFormProps {
    data?: FamilyEntity | null;
    onCancel: () => void;
    onSuccess?: () => void;
}

export function FamiliesForm({ data, onCancel, onSuccess }: FamiliesFormProps) {
    const createFamily = useCreateFamily();
    const updateFamily = useUpdateFamily();
    const { data: taxRates } = useIndexTaxRates();

    const { data: familyData, isLoading: isLoadingFamily } = useShowFamily(
        data?.id || null
    );

    const formData = familyData || data;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            tax_rate_ids: [],
            percentage: 0,
        },
    });

    useEffect(() => {
        if (formData) {
            reset({
                name: formData.name,
                tax_rate_ids: formData.tax_rate_ids,
                percentage: formData.percentage,
            });
        }
    }, [formData, reset]);

    const onSubmit = (values: FormValues) => {
        if (data) {
            // 1. Domain Object
            // Preserve existing is_active status
            const updatedEntity = FamilyEntity.update(data.id, {
                ...values,
                is_active: data.is_active,
            });
            // 2. Plain Object
            const updateData = updatedEntity.toPlainObject();

            updateFamily.mutate(
                { id: data.id, data: updateData },
                {
                    onSuccess: () => {
                        onSuccess?.();
                        onCancel();
                    },
                }
            );
        } else {
            // 1. Domain Object
            // Default is_active to true for new families
            const newEntity = FamilyEntity.create({
                name: values.name,
                tax_rate_ids: values.tax_rate_ids,
                percentage: values.percentage,
                is_active: true,
            });
            // 2. Plain Object
            const createData: CreateFamilyDTO = {
                name: newEntity.name,
                tax_rate_ids: newEntity.tax_rate_ids,
                percentage: newEntity.percentage,
                is_active: newEntity.is_active,
            };

            createFamily.mutate(createData, {
                onSuccess: () => {
                    onSuccess?.();
                    onCancel();
                },
            });
        }
    };

    const isLoading =
        createFamily.isPending || updateFamily.isPending || isLoadingFamily;

    return (
        <Fade in={true}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {/* Header */}
                <Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                        {data ? "Edit Family" : "Create Family"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data
                            ? "Update the family information below."
                            : "Enter the details for the new family."}
                    </Typography>
                </Box>

                <Divider />

                {/* Form Fields */}
                <Stack spacing={3}>
                    {/* Name */}
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                placeholder="e.g. Electronics"
                                variant="filled"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={isLoading}
                            />
                        )}
                    />

                    {/* Tax Rates */}
                    <Controller
                        name="tax_rate_ids"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                multiple
                                disablePortal
                                id="tax-rates-filled"
                                sx={{
                                    "& .MuiFilledInput-root": {
                                        maxHeight: "150px",
                                        overflowY: "auto",
                                    },
                                }}
                                options={taxRates || []}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={
                                    taxRates?.filter((rate) =>
                                        field.value?.includes(rate.id)
                                    ) || []
                                }
                                onChange={(_, newValue) => {
                                    field.onChange(newValue.map((item) => item.id));
                                }}
                                renderTags={(value: readonly any[], getTagProps) =>
                                    value.map((option: any, index: number) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                variant="outlined"
                                                label={option.name}
                                                key={key}
                                                {...tagProps}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Tax Rates"
                                        placeholder="Select Tax Rates"
                                        error={!!errors.tax_rate_ids}
                                        helperText={errors.tax_rate_ids?.message}
                                    />
                                )}
                                disabled={isLoading}
                            />
                        )}
                    />

                    {/* Percentage */}
                    <Controller
                        name="percentage"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                label="Profit Percentage (%)"
                                placeholder="0"
                                variant="filled"
                                fullWidth
                                error={!!errors.percentage}
                                helperText={errors.percentage?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Stack>

                <Divider sx={{ my: 1 }} />

                {/* Actions */}
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
                        {data ? "Update" : "Create"}
                    </Button>
                </Stack>
            </form>
        </Fade>
    );
}
