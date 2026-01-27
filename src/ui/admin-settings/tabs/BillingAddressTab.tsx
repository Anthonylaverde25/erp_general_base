
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function BillingAddressTab() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <input
                placeholder="Calle y número"
                style={{ padding: 10, border: "1px solid #e0e0e0" }}
            />
            <input
                placeholder="Ciudad"
                style={{ padding: 10, border: "1px solid #e0e0e0" }}
            />
            <input
                placeholder="Provincia / Estado"
                style={{ padding: 10, border: "1px solid #e0e0e0" }}
            />
            <input
                placeholder="Código Postal"
                style={{ padding: 10, border: "1px solid #e0e0e0" }}
            />
            <input
                placeholder="País"
                style={{ padding: 10, border: "1px solid #e0e0e0" }}
            />
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
                    Guardar Dirección
                </Button>
            </Box>
        </Box>
    );
}
