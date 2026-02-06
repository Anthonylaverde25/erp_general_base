import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ToggleStoreStatusUseCase } from "@/application/use_cases/stores/ToggleStoreStatusUseCase";
import { toast } from "sonner";

export const useToggleStoreStatus = () => {
    const queryClient = useQueryClient();
    const toggleStoreStatusUseCase = container.get<ToggleStoreStatusUseCase>(TYPES.ToggleStoreStatusUseCase);

    return useMutation({
        mutationFn: (params: { id: number; status: boolean }) =>
            toggleStoreStatusUseCase.execute(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stores"] });
            toast.success("Estado de la tienda actualizado correctamente");
        },
        onError: (error) => {
            console.error("Error al actualizar el estado de la tienda", error);
            toast.error("Error al actualizar el estado de la tienda");
        },
    });
};
