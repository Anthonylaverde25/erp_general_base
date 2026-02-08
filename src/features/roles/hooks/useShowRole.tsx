import { ShowRoleUseCase } from "@/application/use_cases/roles/ShowRoleUsecase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { IRole } from "@/types/role.types";
import { useQuery } from "@tanstack/react-query";

export default function useShowRole(id: IRole["id"]) {
  const use_case = container.get<ShowRoleUseCase>(TYPES.ShowRoleUseCase);

  const query = useQuery({
    queryKey: ["role", id],
    queryFn: () => use_case.execute(id),
    refetchOnWindowFocus: true,
  });

  return {
    role: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
