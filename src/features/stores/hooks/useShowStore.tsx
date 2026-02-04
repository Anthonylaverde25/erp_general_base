import { ShowStoreUseCase } from "@/application/use_cases/stores/ShowStoreUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useQuery } from "@tanstack/react-query";

export default function useShowStore(id: number | null) {
    const use_case = container.get<ShowStoreUseCase>(TYPES.ShowStoreUseCase);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["store", id],
        queryFn: async () => {
            if (!id) return null;
            return await use_case.execute(id);
        },
        enabled: !!id,
    });

    return {
        store: data,
        isLoading,
        isError,
        error,
    };
}
