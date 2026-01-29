import { Contact } from "@/types/company.types";
import {
    Stack,
    Typography,
    Button
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Email, Phone } from "@mui/icons-material";

type Props = {
    contacts: Contact[];
    onChangeContact?: () => void;
};

export default function HeaderDefaultContact({ contacts, onChangeContact }: Props) {
    // Tomamos el primer contacto como "Default" o "Principal" de manera estática
    const defaultContact = contacts[0];

    if (!defaultContact) return null;

    const { email, phone } = defaultContact;

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="stretch"
            justifyContent="space-between"
            spacing={2}
        >
            {/* Bloque contacto */}
            <Stack spacing={0.5}>
                {/* Etiqueta */}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                    Contacto Principal
                </Typography>

                {/* Info Principal */}
                <Stack spacing={0.5}>
                    {email && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body1" fontWeight={500} lineHeight={1.4}>
                                {email}
                            </Typography>
                        </Stack>
                    )}

                    {phone && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" lineHeight={1.4}>
                                {phone}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

            </Stack>

            {/* Acción - Opcional, similar a HeaderDefaultAddress */}
            {onChangeContact && (
                <Button
                    variant="text"
                    size="small"
                    startIcon={
                        <FuseSvgIcon size={16}>
                            heroicons-outline:plus
                        </FuseSvgIcon>
                    }
                    onClick={onChangeContact}
                    sx={{
                        alignSelf: { xs: "flex-start", sm: "center" },
                        whiteSpace: "nowrap"
                    }}
                >
                    Agregar
                </Button>
            )}
        </Stack>
    );
}
