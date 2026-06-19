import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateBatchUseCase } from '@/application/use_cases/batches/UpdateBatchUseCase';
import { IUpdateBatch } from '@/types/batch.types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useUpdateBatch = () => {
	const queryClient = useQueryClient();
	const updateBatchUseCase = container.get<UpdateBatchUseCase>(TYPES.UpdateBatchUseCase);

	const { mutateAsync: handleUpdateBatch, isPending: isLoading } = useMutation({
		mutationFn: ({ id, data }: { id: number; data: IUpdateBatch }) => updateBatchUseCase.execute(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['batches'] });
			queryClient.invalidateQueries({ queryKey: ['batches', variables.id] });
			toast.success('Lote actualizado correctamente');
		},
		onError: (error: unknown) => {
			const axiosError = error as AxiosError<{ message?: string }>;
			toast.error(axiosError.response?.data?.message || 'Error al actualizar lote');
			console.error(error);
		}
	});

	return {
		handleUpdateBatch,
		isLoading
	};
};
