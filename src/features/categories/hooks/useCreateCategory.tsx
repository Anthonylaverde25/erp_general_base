import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateCategoryUseCase } from '@/application/use_cases/categories/CreateCategoryUseCase';
import { CreateCategoryDTO } from '@/domain/entities/categories/DTOs/CategoryDTOs';
import { toast } from 'sonner';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useCreateCategory() {
	const useCase = container.get<CreateCategoryUseCase>(TYPES.CreateCategoryUseCase);
	const queryClient = useQueryClient();
	const activeCompany = useActiveCompany();

	return useMutation({
		mutationFn: (data: CreateCategoryDTO) => useCase.execute(data),
		onSuccess: (response) => {
			toast.success(response.message);
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (error: Error) => {
			toast.error(error.message);
		}
	});
}
