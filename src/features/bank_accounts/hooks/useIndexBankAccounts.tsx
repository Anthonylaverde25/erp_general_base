import { IndexBankAccountUseCase } from "@/application/use_cases/bank_accounts/IndexBankAccountUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useQuery } from "@tanstack/react-query";

export default function useIndexBankAccounts() {
  const use_case = container.get<IndexBankAccountUseCase>(
    TYPES.IndexBankAccountUseCase,
  );
  const query = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: async () => use_case.execute(),
  });

  return {
    bankAccounts: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
