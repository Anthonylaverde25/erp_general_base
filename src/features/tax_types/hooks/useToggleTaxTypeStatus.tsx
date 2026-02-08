import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ToggleTaxTypeStatusUseCase } from "@/application/use_cases/tax_types/ToggleTaxTypeStatusUseCase";
import { toast } from "sonner";

export function useToggleTaxTypeStatus() {
    const queryClient = useQueryClient();
    const useCase = container.get<ToggleTaxTypeStatusUseCase>(TYPES.ToggleTaxTypeStatusUseCase);

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
            return await useCase.execute({ id, status });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tax-types"] });
            toast.success(data.message);
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        },
    });
}
