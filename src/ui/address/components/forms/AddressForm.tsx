import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
    TextField,
    FormControlLabel,
    Switch,
    Box
} from '@mui/material';

interface AddressFormProps {
    prefix?: string;
}

export default function AddressForm({ prefix }: AddressFormProps) {
    const { control } = useFormContext();

    const getName = (name: string) => prefix ? `${prefix}.${name}` : name;

    const renderTextField = (
        name: string,
        label: string,
        placeholder: string,
        autoFocus = false
    ) => (
        <Controller
            name={getName(name)}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    label={label}
                    placeholder={placeholder}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    variant="filled"
                    size="medium"
                    autoFocus={autoFocus && !prefix}
                />
            )}
        />
    );

    return (
        <Box sx={{ mt: 2 }}>

            {/* Calle full width */}
            <Box mb={2}>
                {renderTextField(
                    "street",
                    "Calle y número",
                    "Ej: Av. Libertador 1234",
                    true
                )}
            </Box>

            {/* Fila 2 */}
            <Box
                display="flex"
                gap={2}
                mb={2}
                flexWrap="wrap"
            >
                <Box flex={1} minWidth={220}>
                    {renderTextField("postal_code", "Código Postal", "CP")}
                </Box>

                <Box flex={1} minWidth={220}>
                    {renderTextField("city", "Ciudad", "Ciudad")}
                </Box>
            </Box>

            {/* Fila 3 */}
            <Box
                display="flex"
                gap={2}
                mb={2}
                flexWrap="wrap"
            >
                <Box flex={1} minWidth={220}>
                    {renderTextField("state", "Provincia / Estado", "Provincia")}
                </Box>

                <Box flex={1} minWidth={220}>
                    {renderTextField("country", "País", "País")}
                </Box>
            </Box>

            {/* Switch */}
            <Box
                display="flex"
                justifyContent="start"
                mt={1}
            >
                <Controller
                    name={getName("default")}
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!field.value}
                                    onChange={(e) =>
                                        field.onChange(e.target.checked)
                                    }
                                />
                            }
                            label="Marcar como dirección principal"
                        />
                    )}
                />
            </Box>

        </Box>
    );
}
