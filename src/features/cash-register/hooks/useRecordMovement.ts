import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { RecordMovementUseCase } from '@/application/cash-register/RecordMovementUseCase';
import { IRecordMovementPayload } from '@/types/cash-register.types';

export default function useRecordMovement() {
	const useCase = container.get<RecordMovementUseCase>(TYPES.RecordMovementUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (payload: IRecordMovementPayload) => await useCase.execute(payload),
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['cashRegisterCurrentSession'] });
			enqueueSnackbar(message || 'Movimiento registrado', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'No se pudo registrar el movimiento', { variant: 'error' });
		}
	});
}
