import useIndexPaymentMethods from "@/features/payment_methods/hooks/useIndexPaymentMethods";
import useUpdatePaymentMethod from "@/features/payment_methods/hooks/useUpdatePaymentMethod";
import { useTogglePaymentMethodStatus } from "@/features/payment_methods/hooks/useTogglePaymentMethodStatus";
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
import CreatePaymentMethodModal from "./modals/CreatePaymentMethodModal";
import UpdatePaymentMethodModal from "./modals/UpdatePaymentMethodModal";
import { PaymentMethod } from "@/types/payment_method.types";

export default function PaymentMethodsTabView() {
    const theme = useTheme();
    const { paymentMethods, isLoading, isError } = useIndexPaymentMethods();
    const { handleUpdatePaymentMethod } = useUpdatePaymentMethod();
    const togglePaymentMethodStatus = useTogglePaymentMethodStatus();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        PaymentMethod["id"] | null
    >(null);

    const handleEditPaymentMethod = (paymentMethodId: PaymentMethod["id"]) => {
        setSelectedPaymentMethod(paymentMethodId);
        setUpdateModalOpen(true);
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            await togglePaymentMethodStatus.mutateAsync({
                id,
                status: !currentStatus
            });
        } catch (error) {
            console.error("Error toggling payment method status:", error);
        }
    };

    const getTypeConfig = (type: string) => {
        const configs: Record<string, { label: string; icon: string; color: string }> = {
            cash: {
                label: "Efectivo",
                icon: "heroicons-outline:banknotes",
                color: theme.palette.success.main
            },
            bank_transfer: {
                label: "Transferencia",
                icon: "heroicons-outline:building-library",
                color: theme.palette.info.main
            },
            credit_card: {
                label: "Tarjeta de Crédito",
                icon: "heroicons-outline:credit-card",
                color: theme.palette.primary.main
            },
            debit_card: {
                label: "Tarjeta de Débito",
                icon: "heroicons-outline:credit-card",
                color: theme.palette.secondary.main
            },
            check: {
                label: "Cheque",
                icon: "heroicons-outline:document-text",
                color: theme.palette.warning.main
            },
            other: {
                label: "Otro",
                icon: "heroicons-outline:ellipsis-horizontal-circle",
                color: theme.palette.grey[600]
            },
        };
        return configs[type] || configs.other;
    };

    if (isLoading)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="text.secondary">
                    Cargando métodos de pago...
                </Typography>
            </Box>
        );

    if (isError)
        return (
            <Box className="flex h-64 items-center justify-center">
                <Typography color="error">
                    Error al cargar los métodos de pago
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
                            heroicons-outline:credit-card
                        </FuseSvgIcon>
                    }
                    onClick={() => setCreateModalOpen(true)}
                >
                    Crear método de pago
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
                            <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                            <TableCell align="right" sx={{ pr: 3, fontWeight: 700 }}>
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paymentMethods?.map((paymentMethod) => {
                            const typeConfig = getTypeConfig(paymentMethod.type);
                            return (
                                <TableRow
                                    key={paymentMethod.id}
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
                                            {paymentMethod.name}
                                        </Typography>
                                    </TableCell>

                                    {/* Tipo */}
                                    <TableCell>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <FuseSvgIcon
                                                size={18}
                                                sx={{ color: typeConfig.color }}
                                            >
                                                {typeConfig.icon}
                                            </FuseSvgIcon>
                                            <Typography variant="body2">
                                                {typeConfig.label}
                                            </Typography>
                                        </Stack>
                                    </TableCell>

                                    {/* Descripción */}
                                    <TableCell>
                                        <Typography variant="body2">
                                            {paymentMethod.description || "-"}
                                        </Typography>
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell>
                                        <Tooltip
                                            title={paymentMethod.is_active ? "Desactivar método" : "Activar método"}
                                            placement="top"
                                        >
                                            <Switch
                                                checked={paymentMethod.is_active}
                                                onChange={() => handleToggleActive(paymentMethod.id!, paymentMethod.is_active)}
                                                color="primary"
                                                size="small"
                                            />
                                        </Tooltip>
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        <Tooltip title="Editar método">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditPaymentMethod(paymentMethod.id!)}
                                            >
                                                <FuseSvgIcon size={20}>
                                                    heroicons-outline:pencil-square
                                                </FuseSvgIcon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar método">
                                            <IconButton size="small" color="error">
                                                <FuseSvgIcon size={20}>
                                                    heroicons-outline:trash
                                                </FuseSvgIcon>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {(!paymentMethods || paymentMethods.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay métodos de pago disponibles
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modals */}
            <CreatePaymentMethodModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />

            {selectedPaymentMethod && (
                <UpdatePaymentMethodModal
                    open={updateModalOpen}
                    onClose={() => {
                        setUpdateModalOpen(false);
                        setSelectedPaymentMethod(null);
                    }}
                    paymentMethodId={selectedPaymentMethod}
                />
            )}
        </Box>
    );
}
