import { IndexBankAccountUseCase } from "@/application/use_cases/bank_accounts/IndexBankAccountUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useQuery } from "@tanstack/react-query";

export default function useIndexBankAccounts() {
  const activeCompany = useActiveCompany();


  const use_case = container.get<IndexBankAccountUseCase>(
    TYPES.IndexBankAccountUseCase,
  );
  const query = useQuery({
    queryKey: ["bank-accounts", activeCompany?.id],
    queryFn: async () => use_case.execute(),
  });

  return {
    bankAccounts: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
