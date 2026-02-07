import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ShowFamilyUseCase } from "@/application/use_cases/families/ShowFamilyUseCase";
import { FamilyEntity } from "@/domain/entities/families/FamilyEntity";

export function useShowFamily(id: number | null) {
    const useCase = container.get<ShowFamilyUseCase>(TYPES.ShowFamilyUseCase);

    return useQuery<FamilyEntity, Error>({
        queryKey: ["families", id],
        queryFn: async () => await useCase.execute(id!),
        enabled: !!id,
    });
}
