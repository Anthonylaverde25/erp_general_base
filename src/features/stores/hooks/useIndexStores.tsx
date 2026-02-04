import { IndexStoresUseCase } from "@/application/use_cases/stores/IndexStoresUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useQuery } from "@tanstack/react-query";

export default function useIndexStores() {
    const use_case = container.get<IndexStoresUseCase>(TYPES.IndexStoresUseCase);
    const activeCompany = useActiveCompany();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["stores", activeCompany?.id],
        queryFn: async () => {
            return await use_case.execute();
        },
        enabled: !!activeCompany?.id,
    });

    return {
        stores: data,
        isLoading,
        isError,
        error,
    };
}
