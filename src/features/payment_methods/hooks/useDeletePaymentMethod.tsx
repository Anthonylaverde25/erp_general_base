import { DeletePaymentMethodUseCase } from '@/application/use_cases/payment_methods/DeletePaymentMethodUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useDeletePaymentMethod() {
	const use_case = container.get<DeletePaymentMethodUseCase>(TYPES.DeletePaymentMethodUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async (id: number) => {
			await use_case.execute(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });
			enqueueSnackbar('Método de pago eliminado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al eliminar método de pago', { variant: 'error' });
			console.error(error);
		}
	});

	const handleDeletePaymentMethod = (id: number) => {
		mutation.mutate(id);
	};

	return {
		handleDeletePaymentMethod,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
