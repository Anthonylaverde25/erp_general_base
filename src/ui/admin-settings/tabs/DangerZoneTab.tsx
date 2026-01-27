
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function DangerZoneTab() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1, color: "error.main" }}>
                Danger
            </Typography>
            <Typography color="text.secondary">
                Acciones destructivas relacionadas con la cuenta de la empresa.
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end",
                    mt: 2,
                }}
            >
                <Button className="btn-secondary" variant="outlined">
                    Cancelar
                </Button>
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="error"
                >
                    Eliminar Empresa
                </Button>
            </Box>
        </Box>
    );
}
