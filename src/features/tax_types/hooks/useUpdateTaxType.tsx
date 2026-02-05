import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { UpdateTaxTypeUseCase } from "@/application/use_cases/tax_types/UpdateTaxTypeUseCase";
import { UpdateTaxTypeFormType } from "@/schemas/tax_types/tax_types.schema";
import { toast } from "sonner";
import { TYPES } from "@/di/types";

export default function useUpdateTaxType() {
    const queryClient = useQueryClient();
    const updateTaxTypeUseCase = container.get<UpdateTaxTypeUseCase>(
        TYPES.UpdateTaxTypeUseCase
    );

    const {
        mutateAsync: handleUpdateTaxType,
        isPending: isLoading,
    } = useMutation({
        mutationFn: async ({ id, ...data }: UpdateTaxTypeFormType & { id: number }) => {
            return await updateTaxTypeUseCase.execute(id, data);
        },
        onSuccess: ({ message }) => {
            toast.success(message || "Tipo de impuesto actualizado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["tax-types"] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Error al actualizar el tipo de impuesto";
            toast.error(message);
        },
    });

    return { handleUpdateTaxType, isLoading };
}
