import { CreatePaymentMethodUseCase } from '@/application/use_cases/payment_methods/CreatePaymentMethodUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreatePaymentMethodDTO } from '@/domain/entities/payment_methods/DTOs/CreatePaymentMethodDTO';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useCreatePaymentMethod() {
	const use_case = container.get<CreatePaymentMethodUseCase>(TYPES.CreatePaymentMethodUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async (data: CreatePaymentMethodDTO) => {
			const { paymentMethod, message } = await use_case.execute(data);
			return { paymentMethod, message };
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });
			enqueueSnackbar(message || 'Método de pago creado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al crear método de pago', { variant: 'error' });
			console.error(error);
		}
	});

	const handleCreatePaymentMethod = (data: CreatePaymentMethodDTO) => {
		mutation.mutate(data);
	};

	return {
		handleCreatePaymentMethod,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		isSuccess: mutation.isSuccess
	};
}
