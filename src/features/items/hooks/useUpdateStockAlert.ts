import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateStockAlertUseCase } from '@/application/use_cases/items/UpdateStockAlertUseCase';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useUpdateStockAlert = () => {
	const queryClient = useQueryClient();
	const useCase = container.get<UpdateStockAlertUseCase>(TYPES.UpdateStockAlertUseCase);

	const { mutateAsync: handleUpdateStockAlert, isPending: isLoading } = useMutation({
		mutationFn: ({ id, data }: { id: number; data: { has_stock_alert: boolean; stock_min: number | null } }) =>
			useCase.execute(id, data),
		onSuccess: ({ message }, variables) => {
			queryClient.invalidateQueries({ queryKey: ['items'] });
			queryClient.invalidateQueries({ queryKey: ['items', variables.id] });
			toast.success(message);
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message?: string }>;
			toast.error(axiosError.response?.data?.message || 'Error al actualizar alarma de stock');
			console.error(error);
		}
	});

	return {
		handleUpdateStockAlert,
		isLoading
	};
};
