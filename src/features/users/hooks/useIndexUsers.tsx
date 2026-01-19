import { IndexUserUseCase } from "@/application/use_cases/user/IndexUserUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useQuery } from "@tanstack/react-query";

export default function useIndexUser() {
    const use_case = container.get<IndexUserUseCase>(TYPES.IndexUserUseCase);

    const query = useQuery({
        queryKey: ['users'],
        queryFn: () => use_case.execute(),
        refetchOnWindowFocus: false,
        // staleTime: 5 * 60 * 1000,
    })


    return {
        users: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    }
}