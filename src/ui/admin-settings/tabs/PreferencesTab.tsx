
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PreferencesTab() {
    return (
        <Box sx={{ display: "grid", gap: 2 }}>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    Idioma
                </Typography>
                <select
                    style={{
                        width: "100%",
                        padding: 10,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <option>Español</option>
                    <option>Inglés</option>
                </select>
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    Formato de número
                </Typography>
                <select
                    style={{
                        width: "100%",
                        padding: 10,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <option>1,234.56</option>
                    <option>1.234,56</option>
                </select>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end",
                    mt: 1,
                }}
            >
                <Button className="btn-secondary" variant="outlined">
                    Cancelar
                </Button>
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                >
                    Guardar Preferencias
                </Button>
            </Box>
        </Box>
    );
}
