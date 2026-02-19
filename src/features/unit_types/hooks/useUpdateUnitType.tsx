import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { UpdateUnitTypeUseCase } from "@/application/useCases/unit_types/UpdateUnitTypeUseCase";
import { UpdateUnitTypeDTO } from "@/domain/entities/unit_types/DTOs/UnitTypeDTOs";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { toast } from "sonner";

export function useUpdateUnitType() {
    const queryClient = useQueryClient();
    const useCase = container.get<UpdateUnitTypeUseCase>(TYPES.UpdateUnitTypeUseCase);
    const activeCompany = useActiveCompany();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUnitTypeDTO }) => useCase.execute(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unit-types", activeCompany?.id] });
            toast.success("Tipo de unidad actualizado correctamente");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Error al actualizar el tipo de unidad");
        }
    });
}
