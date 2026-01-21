import { ShowUserUseCase } from "@/application/use_cases/user/ShowUserUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { UserType } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";

export default function useShowUser(id: UserType["id"]) {
  const use_case = container.get<ShowUserUseCase>(TYPES.ShowUserUseCase);

  const query = useQuery({
    queryKey: ["user", id],
    queryFn: () => use_case.execute(id),
    refetchOnWindowFocus: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
