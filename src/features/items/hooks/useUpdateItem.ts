import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateItemUseCase } from '@/application/use_cases/items/UpdateItemUseCase';
import { UpdateItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useUpdateItem = () => {
	const queryClient = useQueryClient();
	const updateItemUseCase = container.get<UpdateItemUseCase>(TYPES.UpdateItemUseCase);

	const { mutateAsync: handleUpdateItem, isPending: isLoading } = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateItemDTO }) => updateItemUseCase.execute(id, data),
		onSuccess: ({ message }, variables) => {
			queryClient.invalidateQueries({ queryKey: ['items'] });
			queryClient.invalidateQueries({ queryKey: ['items', variables.id] });
			toast.success(message);
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message?: string }>;
			toast.error(axiosError.response?.data?.message || 'Error al actualizar artículo');
			console.error(error);
		}
	});

	return {
		handleUpdateItem,
		isLoading
	};
};
