import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
    TextField,
    Stack,
    FormControlLabel,
    Switch
} from '@mui/material';

export default function AddressForm() {
    const { control, formState: { errors } } = useFormContext();

    return (
        <Stack spacing={3}>
            <Controller
                name="street"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Calle y número"
                        placeholder="Ej: Av. Libertador 1234"
                        error={!!errors.street}
                        helperText={errors.street?.message as string}
                        fullWidth
                        variant="filled"
                        autoFocus
                    />
                )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Ciudad"
                            placeholder="Ciudad"
                            error={!!errors.city}
                            helperText={errors.city?.message as string}
                            fullWidth
                            variant="filled"
                        />
                    )}
                />
                <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Provincia / Estado"
                            placeholder="Provincia"
                            error={!!errors.state}
                            helperText={errors.state?.message as string}
                            fullWidth
                            variant="filled"
                        />
                    )}
                />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                    name="postal_code"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Código Postal"
                            placeholder="CP"
                            error={!!errors.postal_code}
                            helperText={errors.postal_code?.message as string}
                            fullWidth
                            variant="filled"
                        />
                    )}
                />
                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="País"
                            placeholder="País"
                            error={!!errors.country}
                            helperText={errors.country?.message as string}
                            fullWidth
                            variant="filled"
                        />
                    )}
                />
            </Stack>

            <Controller
                name="default"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Marcar como dirección principal"
                    />
                )}
            />
        </Stack>
    );
}
