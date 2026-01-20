import { IndexRoleUseCase } from "@/application/use_cases/roles/IndexRoleUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useQuery } from "@tanstack/react-query";

export default function useIndexRoles() {
    const use_case = container.get<IndexRoleUseCase>(TYPES.IndexRoleUseCase);
    const query = useQuery({
        queryKey: ['roles'],
        queryFn: async () => use_case.execute(),

    });

    return {
        roles: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    }
}

