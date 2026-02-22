import { UpdatePaymentMethodUseCase } from '@/application/use_cases/payment_methods/UpdatePaymentMethodUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { PaymentMethodEntity } from '@/domain/entities/payment_methods/PaymentMethod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdatePaymentMethod() {
	const use_case = container.get<UpdatePaymentMethodUseCase>(TYPES.UpdatePaymentMethodUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async ({ id, data }: { id: number; data: Partial<PaymentMethodEntity> }) => {
			const { paymentMethod, message } = await use_case.execute({ id, data });
			return { paymentMethod, message };
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
			queryClient.invalidateQueries({ queryKey: ['paymentMethod'] });
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });
			enqueueSnackbar(message || 'Método de pago actualizado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar método de pago', {
				variant: 'error'
			});
			console.error(error);
		}
	});

	const handleUpdatePaymentMethod = (id: number, data: Partial<PaymentMethodEntity>) => {
		mutation.mutate({ id, data });
	};

	return {
		handleUpdatePaymentMethod,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		isSuccess: mutation.isSuccess
	};
}
