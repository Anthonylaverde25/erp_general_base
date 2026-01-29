import { Address } from "@/types/company.types";
import {
    Box,
    Typography,
    Stack,
    Button
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

type Props = {
    address: Address[];
    onChangeAddress?: () => void;
};

export default function HeaderDefaultAddress({ address, onChangeAddress }: Props) {
    const defaultAddress = address.find((addr) => addr.default);

    if (!defaultAddress) return null;

    const { street, street_2, city, state, postal_code, country } = defaultAddress;

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="stretch"
            justifyContent="space-between"
            spacing={2}
        >
            {/* Bloque dirección */}
            <Stack spacing={0.5}>
                {/* Etiqueta */}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                    Dirección fiscal
                </Typography>

                {/* Línea principal */}
                <Typography variant="body1" fontWeight={500} lineHeight={1.4}>
                    {street}
                </Typography>

                {street_2 && (
                    <Typography variant="body2" color="text.secondary" lineHeight={1.4}>
                        {street_2}
                    </Typography>
                )}

                {/* Metadatos */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Typography variant="body2" color="text.secondary">
                        {city}, {state}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        • CP {postal_code}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {country}
                    </Typography>
                </Stack>
            </Stack>

            {/* Acción */}
            <Button
                variant="text"
                size="small"
                startIcon={
                    <FuseSvgIcon size={16}>
                        heroicons-outline:arrow-path
                    </FuseSvgIcon>
                }
                onClick={onChangeAddress}
                sx={{
                    alignSelf: { xs: "flex-start", sm: "center" },
                    whiteSpace: "nowrap"
                }}
            >
                Cambiar
            </Button>
        </Stack>
    );
}
