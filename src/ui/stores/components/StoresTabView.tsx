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
    Switch,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import useIndexStores from "@/features/stores/hooks/useIndexStores";
import useDeleteStore from "@/features/stores/hooks/useDeleteStore";
import useUpdateStore from "@/features/stores/hooks/useUpdateStore";
import CreateStoreModal from "./modals/CreateStoreModal";
import UpdateStoreModal from "./modals/UpdateStoreModal";
import { StoreEntity } from "@/domain/entities/stores/StoreEntity";

export default function StoresTabView() {
    const theme = useTheme();
    const { stores, isLoading, isError } = useIndexStores();
    const { handleDeleteStore } = useDeleteStore();
    const { handleUpdateStore } = useUpdateStore();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);

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

    const handleEditStore = (storeId: number) => {
        setSelectedStore(storeId);
        setUpdateModalOpen(true);
    };

    const handleToggleActive = async (store: StoreEntity) => {
        try {
            await handleUpdateStore({
                id: store.id!,
                data: { is_active: !store.is_active }
            });
        } catch (error) {
            console.error("Error toggling store status:", error);
        }
    };

    const onDeleteStore = async (storeId: number) => {
        if (confirm("¿Está seguro de eliminar esta tienda?")) {
            await handleDeleteStore(storeId);
        }
    };

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
                                            onChange={() => handleToggleActive(store)}
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
                                            onClick={() => handleEditStore(store.id!)}
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
                                            onClick={() => onDeleteStore(store.id!)}
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

            {/* Modals */}
            <CreateStoreModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />

            {selectedStore && (
                <UpdateStoreModal
                    open={updateModalOpen}
                    onClose={() => {
                        setUpdateModalOpen(false);
                        setSelectedStore(null);
                    }}
                    storeId={selectedStore}
                />
            )}
        </Box>
    );
}
