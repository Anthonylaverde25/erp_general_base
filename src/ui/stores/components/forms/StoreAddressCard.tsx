import React from "react";
import { Box, Typography, Stack, Button, IconButton, alpha } from "@mui/material";
import { LocationOn, Map as MapIcon, Edit, Delete } from "@mui/icons-material";

// Define a type for the address shape used in the form
type AddressFormValues = {
    street: string;
    street_2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
};

type Props = {
    address: AddressFormValues;
    onEdit: () => void;
    onDelete?: () => void;
};

export default function StoreAddressCard({ address, onEdit, onDelete }: Props) {
    const { street, street_2, city, state, postal_code, country } = address;

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="stretch"
            justifyContent="space-between"
            spacing={2}
            sx={{
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                borderLeftWidth: 4,
                borderLeftColor: 'primary.main',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
            }}
        >
            {/* Bloque dirección */}
            <Stack spacing={0.5}>
                {/* Línea principal */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Box>
                        <Typography variant="body1" fontWeight={600} lineHeight={1.4}>
                            {street}
                        </Typography>
                        {street_2 && (
                            <Typography variant="body2" color="text.secondary" lineHeight={1.4}>
                                {street_2}
                            </Typography>
                        )}
                    </Box>
                </Stack>

                {/* Metadatos */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <MapIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Typography variant="body2" color="text.secondary">
                            {city}, {state}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            • CP {postal_code}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            • {country}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>

            {/* Acciones */}
            <Stack direction="row" spacing={1} alignItems="center" alignSelf={{ xs: "flex-start", sm: "center" }}>
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={<Edit fontSize="small" />}
                    onClick={onEdit}
                    sx={{
                        whiteSpace: "nowrap",
                        borderColor: 'divider'
                    }}
                >
                    Editar
                </Button>
                {onDelete && (
                    <IconButton size="small" color="error" onClick={onDelete}>
                        <Delete fontSize="small" />
                    </IconButton>
                )}
            </Stack>
        </Stack>
    );
}
