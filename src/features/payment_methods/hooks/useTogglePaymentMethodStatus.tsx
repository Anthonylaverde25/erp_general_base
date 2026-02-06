import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { TogglePaymentMethodStatusUseCase } from "@/application/use_cases/payment_methods/TogglePaymentMethodStatusUseCase";
import { toast } from "sonner";

export const useTogglePaymentMethodStatus = () => {
    const queryClient = useQueryClient();
    const togglePaymentMethodStatusUseCase = container.get<TogglePaymentMethodStatusUseCase>(TYPES.TogglePaymentMethodStatusUseCase);

    return useMutation({
        mutationFn: (params: { id: number; status: boolean }) =>
            togglePaymentMethodStatusUseCase.execute(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
            toast.success("Estado del método de pago actualizado correctamente");
        },
        onError: (error) => {
            console.error("Error al actualizar el estado del método de pago", error);
            toast.error("Error al actualizar el estado del método de pago");
        },
    });
};
