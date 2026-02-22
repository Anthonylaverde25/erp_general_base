import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateItemUseCase } from '@/application/use_cases/items/CreateItemUseCase';
import { CreateItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';
import { toast } from 'sonner';

export const useCreateItem = () => {
	const queryClient = useQueryClient();
	const createItemUseCase = container.get<CreateItemUseCase>(TYPES.CreateItemUseCase);

	const { mutateAsync: handleCreateItem, isPending: isLoading } = useMutation({
		mutationFn: (data: CreateItemDTO) => createItemUseCase.execute(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['items'] });
			toast.success(data.message);
		},

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Error al crear artículo');
			console.error(error);
		}
	});

	return {
		handleCreateItem,
		isLoading
	};
};
