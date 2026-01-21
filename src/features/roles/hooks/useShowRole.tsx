import { ShowRoleUseCase } from "@/application/use_cases/roles/ShowRoleUsecase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { RoleType } from "@/types/role.types";
import { useQuery } from "@tanstack/react-query";

export default function useShowRole(id: RoleType["id"]) {
  const use_case = container.get<ShowRoleUseCase>(TYPES.ShowRoleUseCase);

  console.log("id del rol desde el hook", id);

  const query = useQuery({
    queryKey: ["role", id],
    queryFn: () => use_case.execute(id),
    refetchOnWindowFocus: false,
  });

  console.log("query data del rol desde el hook", query.data);

  return {
    role: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
