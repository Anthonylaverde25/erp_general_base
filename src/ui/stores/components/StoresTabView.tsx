import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Stack,
    Button,
    useTheme,
    alpha,
    Chip,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import useIndexStores from "@/features/stores/hooks/useIndexStores";

export default function StoresTabView() {
    const theme = useTheme();
    const { stores, isLoading, isError } = useIndexStores();

    const [createModalOpen, setCreateModalOpen] = useState(false);

    if (isLoading)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="text.secondary">
                    Cargando tiendas...
                </Typography>
            </Box>
        );

    if (isError)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="error">
                    Error al cargar las tiendas
                </Typography>
            </Box>
        );

    return (
        <Box className="w-full overflow-hidden">
            {/* Header Section */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <div />
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={
                        <FuseSvgIcon size={20}>
                            heroicons-outline:building-storefront
                        </FuseSvgIcon>
                    }
                    onClick={() => setCreateModalOpen(true)}
                >
                    Crear tienda
                </Button>
            </Stack>

            {/* Table Section */}
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow
                            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                        >
                            <TableCell sx={{ pl: 3, fontWeight: 700 }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
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
                                    <Typography variant="body2" color="text.secondary">
                                        {store.code || "-"}
                                    </Typography>
                                </TableCell>

                                {/* Estado */}
                                <TableCell>
                                    <Chip
                                        className="w-[100px]"
                                        label={store.is_active ? "Activo" : "Inactivo"}
                                        variant="filled"
                                    />
                                </TableCell>

                                {/* Acciones */}
                                <TableCell align="right" sx={{ pr: 3 }}>
                                    <Tooltip title="Editar tienda">
                                        <IconButton
                                            size="small"
                                            onClick={() => { }}
                                        >
                                            <FuseSvgIcon size={20}>
                                                heroicons-outline:pencil-square
                                            </FuseSvgIcon>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar tienda">
                                        <IconButton size="small" color="error">
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
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay tiendas disponibles
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
