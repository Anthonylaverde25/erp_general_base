import React, { useState } from 'react';
import { Address } from "@/types/company.types";
import { LiaExchangeAltSolid } from "react-icons/lia";
import {
    Box,
    Typography,
    Stack,
    Button
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { LocationOn, Map as MapIcon } from "@mui/icons-material";
import SelectDefaultAddressModal from "@/ui/address/components/modals/SelectDefaultAddressModal";

type Props = {
    address: Address[];
    onSetDefault: (id: number) => void;
};

export default function HeaderDefaultAddress({ address, onSetDefault }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const defaultAddress = address.find((addr) => addr.default);

    const handleSelect = (id: number) => {
        onSetDefault(id);
        setModalOpen(false);
    };

    if (!defaultAddress) {
        return (
            <>
                <Stack
                    className="flex justify-between"
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        p: 2,
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                        borderLeftWidth: 4,
                        borderLeftColor: 'warning.main',
                        bgcolor: 'background.paper',
                        boxShadow: 0
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><FuseSvgIcon size={24} color="warning">heroicons-outline:exclamation-triangle</FuseSvgIcon>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                                Atención
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Es necesario establecer una dirección por defecto para ser usada para facturación.
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        color="inherit"
                        startIcon={
                            <LiaExchangeAltSolid />

                        }
                        onClick={() => setModalOpen(true)}
                        sx={{
                            alignSelf: { xs: "flex-start", sm: "center" },
                            whiteSpace: "nowrap",
                            borderColor: 'divider'
                        }}
                    >
                        Establecer
                    </Button>

                </Stack>

                <SelectDefaultAddressModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    items={address}
                    currentDefaultId={defaultAddress?.id}
                    onSelect={handleSelect}
                />
            </>
        );
    }

    const { street, street_2, city, state, postal_code, country } = defaultAddress;

    return (
        <>
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
                    borderLeftColor: 'primary.main', // Color primario para indicar "Default/Active"
                    bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'background.default',
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

                {/* Acción */}
                <Button
                    variant="outlined"
                    size="small"
                    color="inherit"
                    startIcon={
                        <FuseSvgIcon size={16}>
                            heroicons-outline:pencil
                        </FuseSvgIcon>
                    }
                    onClick={() => setModalOpen(true)}
                    sx={{
                        alignSelf: { xs: "flex-start", sm: "center" },
                        whiteSpace: "nowrap",
                        borderColor: 'divider'
                    }}
                >
                    Cambiar
                </Button>
            </Stack>

            <SelectDefaultAddressModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                items={address}
                currentDefaultId={defaultAddress?.id}
                onSelect={handleSelect}
            />
        </>
    );
}
