import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { DeleteUnitUseCase } from "@/application/useCases/units/DeleteUnitUseCase";
import useActiveCompany from "@/features/companies/useActiveCompany";

export function useDeleteUnit() {
    const queryClient = useQueryClient();
    const useCase = container.get<DeleteUnitUseCase>(TYPES.DeleteUnitUseCase);
    const activeCompany = useActiveCompany();

    return useMutation({
        mutationFn: (id: number) => useCase.execute(id),
        onSuccess: () => {
            toast.success("Unit deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["units", activeCompany?.id] });
        },
        onError: (error: Error) => {
            toast.error(`Error deleting unit: ${error.message}`);
        },
    });
}
