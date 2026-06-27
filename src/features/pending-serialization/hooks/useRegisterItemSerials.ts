import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { RegisterItemSerialsUseCase } from '@/application/use_cases/pending-serialization/RegisterItemSerialsUseCase';
import { RegisterSerialsPayload } from '@/types/pending-serialization.types';
import { toast } from 'sonner';

export function useRegisterItemSerials() {
	const useCase = container.get<RegisterItemSerialsUseCase>(TYPES.RegisterItemSerialsUseCase);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: RegisterSerialsPayload }) =>
			useCase.execute(id, payload),
		onSuccess: () => {
			toast.success('Serial numbers registered successfully');
			queryClient.invalidateQueries({ queryKey: ['pending-serialization'] });
		},
		onError: (error: any) => {
			const errMsg = error.response?.data?.message || error.message || 'Error registering serial numbers';
			toast.error(errMsg);
		}
	});
}
