import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ToggleCategoryStatusUseCase } from '@/application/use_cases/categories/ToggleCategoryStatusUseCase';
import { toast } from 'sonner';

export function useToggleCategoryStatus() {
	const useCase = container.get<ToggleCategoryStatusUseCase>(TYPES.ToggleCategoryStatusUseCase);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: { id: number; status: boolean }) => useCase.execute(id, status),
		onSuccess: () => {
			toast.success('Category status updated successfully');
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		}
	});
}
