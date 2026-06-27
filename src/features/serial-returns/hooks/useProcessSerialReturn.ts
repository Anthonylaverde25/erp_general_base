import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ProcessSerialReturnUseCase } from '@/application/use_cases/serial-returns/ProcessSerialReturnUseCase';
import { IProcessSerialReturnPayload } from '@/types/serial-returns.types';
import { toast } from 'sonner';

export function useProcessSerialReturn() {
	const useCase = container.get<ProcessSerialReturnUseCase>(TYPES.ProcessSerialReturnUseCase);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: IProcessSerialReturnPayload }) =>
			useCase.execute(id, payload),
		onSuccess: () => {
			toast.success('Technical inspection registered successfully');
			queryClient.invalidateQueries({ queryKey: ['serial-returns'] });
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Error processing the serial return');
		}
	});
}
