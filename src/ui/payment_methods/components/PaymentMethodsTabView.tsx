import useIndexPaymentMethods from "@/features/payment_methods/hooks/useIndexPaymentMethods";
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
    Chip,
    CircularProgress,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import CreatePaymentMethodModal from "./modals/CreatePaymentMethodModal";
import UpdatePaymentMethodModal from "./modals/UpdatePaymentMethodModal";
import { PaymentMethod } from "@/types/payment_method.types";

export default function PaymentMethodsTabView() {
    const theme = useTheme();
    const { paymentMethods, isLoading, isError } = useIndexPaymentMethods();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        PaymentMethod["id"] | null
    >(null);

    const handleEditPaymentMethod = (paymentMethodId: PaymentMethod["id"]) => {
        setSelectedPaymentMethod(paymentMethodId);
        setUpdateModalOpen(true);
    };

    const getTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            cash: "Efectivo",
            bank_transfer: "Transferencia",
            credit_card: "Tarjeta de Crédito",
            debit_card: "Tarjeta de Débito",
            check: "Cheque",
            other: "Otro",
        };
        return types[type] || type;
    };

    if (isLoading)
        return (
            <Box className="flex h-96 items-center justify-center">
                <CircularProgress size={32} />
            </Box>
        );

    if (isError)
        return (
            <Box className="flex h-96 items-center justify-center">
                <Typography color="error">Error al cargar</Typography>
            </Box>
        );

    return (
        <Box className="w-full">
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Button
                    className="btn-primary"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
                    onClick={() => setCreateModalOpen(true)}
                >
                    Agregar método de pago
                </Button>
            </Stack>

            {/* Table */}
            {(!paymentMethods || paymentMethods.length === 0) ? (
                <Box sx={{ p: 8, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        No hay métodos de pago
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
                        onClick={() => setCreateModalOpen(true)}
                        sx={{ mt: 2 }}
                    >
                        Agregar método
                    </Button>
                </Box>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.75rem" }}>
                                    NOMBRE
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.75rem" }}>
                                    TIPO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.75rem" }}>
                                    DESCRIPCIÓN
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.75rem" }}>
                                    ESTADO
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.75rem" }}>
                                    ACCIONES
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paymentMethods.map((paymentMethod) => (
                                <TableRow
                                    key={paymentMethod.id}
                                    sx={{
                                        "&:hover": { backgroundColor: theme.palette.action.hover },
                                        "&:last-child td": { borderBottom: 0 },
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {paymentMethod.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {getTypeLabel(paymentMethod.type)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {paymentMethod.description || "-"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={paymentMethod.is_active ? "Activo" : "Inactivo"}
                                            size="small"
                                            variant="outlined"
                                            color={paymentMethod.is_active ? "success" : "default"}
                                            sx={{ height: 22, fontSize: "0.75rem" }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditPaymentMethod(paymentMethod.id!)}
                                            >
                                                <FuseSvgIcon size={18}>heroicons-outline:pencil</FuseSvgIcon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small">
                                                <FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

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
