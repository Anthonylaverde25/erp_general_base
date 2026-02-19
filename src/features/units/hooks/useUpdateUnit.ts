import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { UpdateUnitUseCase } from "@/application/useCases/units/UpdateUnitUseCase";
import { UpdateUnitDTO } from "@/domain/entities/units/DTOs/UnitDTOs";
import useActiveCompany from "@/features/companies/useActiveCompany";

export function useUpdateUnit() {
    const queryClient = useQueryClient();
    const useCase = container.get<UpdateUnitUseCase>(TYPES.UpdateUnitUseCase);
    const activeCompany = useActiveCompany();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUnitDTO }) => useCase.execute(id, data),
        onSuccess: () => {
            toast.success("Unit updated successfully");
            queryClient.invalidateQueries({ queryKey: ["units", activeCompany?.id] });
        },
        onError: (error: Error) => {
            toast.error(`Error updating unit: ${error.message}`);
        },
    });
}
