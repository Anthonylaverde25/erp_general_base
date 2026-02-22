import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateFamilyUseCase } from '@/application/use_cases/families/UpdateFamilyUseCase';
import { FamilyEntity, Family } from '@/domain/entities/families/FamilyEntity';
import { toast } from 'sonner';

export function useUpdateFamily() {
	const queryClient = useQueryClient();
	const useCase = container.get<UpdateFamilyUseCase>(TYPES.UpdateFamilyUseCase);

	return useMutation<{ family: FamilyEntity; message: string }, Error, { id: number; data: Partial<Family> }>({
		mutationFn: async ({ id, data }) => await useCase.execute({ id, data }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['families'] });
			toast.success(data.message);
		}
	});
}
