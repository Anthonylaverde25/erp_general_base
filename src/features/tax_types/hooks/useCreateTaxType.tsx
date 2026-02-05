import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { CreateTaxTypeUseCase } from "@/application/use_cases/tax_types/CreateTaxTypeUseCase";
import { CreateTaxTypeFormType } from "@/schemas/tax_types/tax_types.schema";
import { toast } from "sonner";
import { TYPES } from "@/di/types";

export default function useCreateTaxType() {
    const queryClient = useQueryClient();
    const use_case = container.get<CreateTaxTypeUseCase>(
        TYPES.CreateTaxTypeUseCase,
    );

    const {
        mutateAsync: handleCreateTaxType,
        isPending: isLoading,
    } = useMutation({
        mutationFn: async (data: CreateTaxTypeFormType) => {
            return await use_case.execute(data);
        },
        onSuccess: ({ message }) => {
            toast.success(message || "Tipo de impuesto creado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["tax-types"] });
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                "Error al crear el tipo de impuesto";
            toast.error(message);
        },
    });

    return { handleCreateTaxType, isLoading };
}
