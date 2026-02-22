import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { AdjustStockEntryUseCase } from '@/application/use_cases/items/AdjustStockEntryUseCase';
import { AdjustStockEntryDTO } from '@/domain/entities/items/repositories/item.action.repository';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useAdjustStockEntry = () => {
	const queryClient = useQueryClient();
	const useCase = container.get<AdjustStockEntryUseCase>(TYPES.AdjustStockEntryUseCase);

	const { mutateAsync: handleAdjustStockEntry, isPending: isLoading } = useMutation({
		mutationFn: (data: AdjustStockEntryDTO) => useCase.execute(data),
		onSuccess: ({ message }, variables) => {
			queryClient.invalidateQueries({ queryKey: ['items'] });
			queryClient.invalidateQueries({ queryKey: ['items', variables.item_id] });
			toast.success(message);
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message?: string }>;
			toast.error(axiosError.response?.data?.message || 'Error al registrar entrada de stock');
			console.error(error);
		}
	});

	return {
		handleAdjustStockEntry,
		isLoading
	};
};
