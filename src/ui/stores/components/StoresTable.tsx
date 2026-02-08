import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
    useTheme,
    alpha,
    Switch,
    Stack,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { StoreEntity } from "@/domain/entities/stores/StoreEntity";

interface StoresTableProps {
    stores: StoreEntity[] | undefined;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, currentStatus: boolean) => void;
}

export default function StoresTable(props: StoresTableProps) {
    const { stores, onEdit, onDelete, onStatusChange } = props;
    const theme = useTheme();

    const formatAddress = (store: StoreEntity) => {
        if (!store.address) return null;
        const { street, street_2, city, state, postal_code, country } = store.address;
        return {
            short: `${city}, ${state}`,
            full: [
                street,
                street_2,
                `${city}, ${state} ${postal_code}`,
                country
            ].filter(Boolean).join(', ')
        };
    };

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                    >
                        <TableCell sx={{ pl: 3, fontWeight: 700 }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Dirección</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                        <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                            Acciones
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {stores?.map((store) => (
                        <TableRow
                            key={store.id}
                            hover
                            sx={{
                                transition: "all 0.2s ease",
                                "&:last-child td": { borderBottom: 0 },
                                "&:nth-of-type(odd)": {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.4),
                                },
                                "&:nth-of-type(even)": {
                                    backgroundColor: "transparent",
                                },
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            {/* Nombre */}
                            <TableCell sx={{ pl: 3 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {store.name}
                                </Typography>
                            </TableCell>

                            {/* Código */}
                            <TableCell>
                                <Typography variant="body2">
                                    {store.code || "-"}
                                </Typography>
                            </TableCell>

                            {/* Dirección */}
                            <TableCell>
                                {formatAddress(store) ? (
                                    <Tooltip
                                        title={formatAddress(store)!.full}
                                        placement="top"
                                    >
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <FuseSvgIcon size={16} color="action">
                                                heroicons-outline:map-pin
                                            </FuseSvgIcon>
                                            <Typography variant="body2">
                                                {formatAddress(store)!.short}
                                            </Typography>
                                        </Stack>
                                    </Tooltip>
                                ) : (
                                    <Typography variant="body2" color="text.disabled" fontStyle="italic">
                                        Sin dirección
                                    </Typography>
                                )}
                            </TableCell>

                            {/* Estado */}
                            <TableCell>
                                <Tooltip
                                    title={store.is_active ? "Desactivar tienda" : "Activar tienda"}
                                    placement="top"
                                >
                                    <Switch
                                        checked={store.is_active}
                                        onChange={() => onStatusChange(store.id!, store.is_active)}
                                        color="primary"
                                        size="small"
                                    />
                                </Tooltip>
                            </TableCell>

                            {/* Acciones */}
                            <TableCell align="right" sx={{ pr: 3 }}>
                                <Tooltip title="Editar tienda">
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(store.id!)}
                                    >
                                        <FuseSvgIcon size={20}>
                                            heroicons-outline:pencil-square
                                        </FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar tienda">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDelete(store.id!)}
                                    >
                                        <FuseSvgIcon size={20}>
                                            heroicons-outline:trash
                                        </FuseSvgIcon>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}

                    {(!stores || stores.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay tiendas disponibles
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
