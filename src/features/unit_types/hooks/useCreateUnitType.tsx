import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateUnitTypeUseCase } from "@/application/useCases/unit_types/CreateUnitTypeUseCase";
import { CreateUnitTypeDTO } from "@/domain/entities/unit_types/DTOs/UnitTypeDTOs";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { toast } from "sonner";

export function useCreateUnitType() {
    const queryClient = useQueryClient();
    const useCase = container.get<CreateUnitTypeUseCase>(TYPES.CreateUnitTypeUseCase);
    const activeCompany = useActiveCompany();

    return useMutation({
        mutationFn: (data: CreateUnitTypeDTO) => useCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unit-types", activeCompany?.id] });
            toast.success("Tipo de unidad creado correctamente");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Error al crear el tipo de unidad");
        }
    });
}
