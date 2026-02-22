import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateCategoryUseCase } from '@/application/use_cases/categories/UpdateCategoryUseCase';
import { UpdateCategoryDTO } from '@/domain/entities/categories/DTOs/CategoryDTOs';
import { toast } from 'sonner';

export function useUpdateCategory() {
	const useCase = container.get<UpdateCategoryUseCase>(TYPES.UpdateCategoryUseCase);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateCategoryDTO }) => useCase.execute(id, data),
		onSuccess: (response) => {
			toast.success(response.message);
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		}
	});
}
