import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ShowCategoryUseCase } from "@/application/use_cases/categories/ShowCategoryUseCase";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";

export function useShowCategory(id: number | null) {
    const useCase = container.get<ShowCategoryUseCase>(TYPES.ShowCategoryUseCase);

    return useQuery<CategoryEntity, Error>({
        queryKey: ["category", id],
        queryFn: async () => await useCase.execute(id!),
        enabled: !!id,
    });
}
