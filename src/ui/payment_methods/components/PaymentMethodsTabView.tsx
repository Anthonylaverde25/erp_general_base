import useIndexPaymentMethods from "@/features/payment_methods/hooks/useIndexPaymentMethods";
import useUpdatePaymentMethod from "@/features/payment_methods/hooks/useUpdatePaymentMethod";
import { useTogglePaymentMethodStatus } from "@/features/payment_methods/hooks/useTogglePaymentMethodStatus";
import {
    Typography,
    Box,
    Stack,
    Button,
    useTheme,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import CreatePaymentMethodModal from "./modals/CreatePaymentMethodModal";
import UpdatePaymentMethodModal from "./modals/UpdatePaymentMethodModal";
import { PaymentMethod } from "@/types/payment_method.types";
import PaymentMethodsTable from "./PaymentMethodsTable";

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
            {/* Table Section */}
            <PaymentMethodsTable
                paymentMethods={paymentMethods}
                onEdit={(id) => handleEditPaymentMethod(id)}
                onDelete={() => { }}
                onStatusChange={handleToggleActive}
            />

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
