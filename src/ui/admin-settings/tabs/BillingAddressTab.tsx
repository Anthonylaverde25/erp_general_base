import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormContext } from 'react-hook-form';
import { CompanySettingsForm } from '../pages/SettingPage';

export default function BillingAddressTab() {
    const { register } = useFormContext<CompanySettingsForm>();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
                {...register("billing_address.street")}
                label="Calle y número"
                placeholder="Calle y número"
                fullWidth
                size="small"
            />
            <TextField
                {...register("billing_address.city")}
                label="Ciudad"
                placeholder="Ciudad"
                fullWidth
                size="small"
            />
            <TextField
                {...register("billing_address.state")}
                label="Provincia / Estado"
                placeholder="Provincia / Estado"
                fullWidth
                size="small"
            />
            <TextField
                {...register("billing_address.zip")}
                label="Código Postal"
                placeholder="Código Postal"
                fullWidth
                size="small"
            />
            <TextField
                {...register("billing_address.country")}
                label="País"
                placeholder="País"
                fullWidth
                size="small"
            />
        </Box>
    );
}
