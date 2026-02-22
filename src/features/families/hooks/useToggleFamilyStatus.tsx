import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ToggleFamilyStatusUseCase } from '@/application/use_cases/families/ToggleFamilyStatusUseCase';
import { toast } from 'sonner';

export const useToggleFamilyStatus = () => {
	const queryClient = useQueryClient();
	const toggleFamilyStatusUseCase = container.get<ToggleFamilyStatusUseCase>(TYPES.ToggleFamilyStatusUseCase);

	return useMutation({
		mutationFn: (params: { id: number; status: boolean }) => toggleFamilyStatusUseCase.execute(params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['families'] });
			toast.success('Family status updated successfully');
		},
		onError: (error) => {
			console.error('Failed to update family status', error);
			toast.error('Failed to update family status');
		}
	});
};
