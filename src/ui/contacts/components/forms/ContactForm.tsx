import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
    TextField,
    Stack,
    FormControlLabel,
    Switch
} from '@mui/material';

export default function ContactForm() {
    const { control, formState: { errors } } = useFormContext();

    return (
        <Stack spacing={3}>
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Correo Electrónico"
                        placeholder="contacto@empresa.com"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                        fullWidth
                        variant="filled"
                        autoFocus
                    />
                )}
            />

            <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Teléfono"
                        placeholder="+54 11 1234-5678"
                        type="tel"
                        error={!!errors.phone}
                        helperText={errors.phone?.message as string}
                        fullWidth
                        variant="filled"
                    />
                )}
            />

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
                        label="Marcar como contacto principal"
                    />
                )}
            />
        </Stack>
    );
}
