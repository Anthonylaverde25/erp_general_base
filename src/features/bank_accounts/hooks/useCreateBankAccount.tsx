import { CreateBankAccountUseCase } from "@/application/use_cases/bank_accounts/CreateBankAccountUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateBankAccountType } from "@/types/bank_account.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

export default function useCreateBankAccount() {
  const use_case = container.get<CreateBankAccountUseCase>(
    TYPES.CreateBankAccountUseCase,
  );
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: (data: CreateBankAccountType) => use_case.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      enqueueSnackbar("Cuenta bancaria creada exitosamente", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error?.response?.data?.message || "Error al crear cuenta bancaria",
        { variant: "error" },
      );
      console.error(error);
    },
  });

  const handleCreateBankAccount = (data: CreateBankAccountType) => {
    mutation.mutateAsync(data);
  };

  return {
    handleCreateBankAccount,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
