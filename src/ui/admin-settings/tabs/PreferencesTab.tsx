import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useFormContext } from 'react-hook-form';
import { CompanySettingsForm } from '../pages/SettingPage';

export default function PreferencesTab() {
    const { register, watch } = useFormContext<CompanySettingsForm>();
    const language = watch("preferences.language");
    const numberFormat = watch("preferences.number_format");

    return (
        <Box sx={{ display: "grid", gap: 2 }}>
            <Box>
                <TextField
                    {...register("preferences.language")}
                    select
                    label="Idioma"
                    value={language || "Español"}
                    fullWidth
                    size="small"
                    defaultValue="Español"
                >
                    <MenuItem value="Español">Español</MenuItem>
                    <MenuItem value="Inglés">Inglés</MenuItem>
                </TextField>
            </Box>
            <Box>
                <TextField
                    {...register("preferences.number_format")}
                    select
                    label="Formato de número"
                    value={numberFormat || "1,234.56"}
                    fullWidth
                    size="small"
                    defaultValue="1,234.56"
                >
                    <MenuItem value="1,234.56">1,234.56</MenuItem>
                    <MenuItem value="1.234,56">1.234,56</MenuItem>
                </TextField>
            </Box>
        </Box>
    );
}
