import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { IndexRoleUseCase } from "@/application/use_cases/roles/IndexRoleUseCase";

export default function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const useCase = container.get<IndexRoleUseCase>(TYPES.IndexRoleUseCase);
            return await useCase.execute();
        }
    });
}
