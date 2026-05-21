import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ToggleMovementCheckedUseCase } from '@/application/cash-register/ToggleMovementCheckedUseCase';

export default function useToggleMovementChecked() {
	const useCase = container.get<ToggleMovementCheckedUseCase>(TYPES.ToggleMovementCheckedUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (movementId: number) => await useCase.execute(movementId),
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['cashRegisterCurrentSession'] });
			enqueueSnackbar(message || 'Estado de verificación actualizado', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'No se pudo actualizar el estado de verificación', { variant: 'error' });
		}
	});
}
