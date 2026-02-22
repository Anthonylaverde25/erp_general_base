import { UpdateBankAccountUseCase } from '@/application/use_cases/bank_accounts/UpdateBankAccountUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IUpdateBankAccount } from '@/types/bank_account.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateBankAccount() {
	const use_case = container.get<UpdateBankAccountUseCase>(TYPES.UpdateBankAccountUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: IUpdateBankAccount }) => use_case.execute(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
			queryClient.invalidateQueries({ queryKey: ['bank-account', id] });
			enqueueSnackbar('Cuenta bancaria actualizada exitosamente', {
				variant: 'success'
			});
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar cuenta bancaria', {
				variant: 'error'
			});
			console.error(error);
		}
	});

	const handleUpdateBankAccount = (id: number, data: IUpdateBankAccount) => {
		mutation.mutate({ id, data });
	};

	return {
		handleUpdateBankAccount,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
