import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { IndexCategoriesUseCase } from "@/application/use_cases/categories/IndexCategoriesUseCase";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";
import useActiveCompany from "@/features/companies/useActiveCompany";

export function useIndexCategories() {
    const useCase = container.get<IndexCategoriesUseCase>(TYPES.IndexCategoriesUseCase);
    const activeCompany = useActiveCompany();

    const { data: categories = [], isLoading } = useQuery<CategoryEntity[], Error>({
        queryKey: ["categories", activeCompany?.id],
        queryFn: async () => await useCase.execute(),
    });

    return {
        categories,
        isLoading
    };
}

