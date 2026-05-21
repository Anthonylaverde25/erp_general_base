import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CloseSessionUseCase } from '@/application/cash-register/CloseSessionUseCase';
import { ICloseSessionPayload } from '@/types/cash-register.types';

export default function useCloseSession() {
	const useCase = container.get<CloseSessionUseCase>(TYPES.CloseSessionUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (payload: ICloseSessionPayload) => await useCase.execute(payload),
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['cashRegisterCurrentSession'] });
			enqueueSnackbar(message || 'Caja cerrada correctamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'No se pudo cerrar la caja', { variant: 'error' });
		}
	});
}
