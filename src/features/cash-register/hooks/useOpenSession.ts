import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { OpenSessionUseCase } from '@/application/cash-register/OpenSessionUseCase';
import { IOpenSessionPayload } from '@/types/cash-register.types';

export default function useOpenSession() {
	const useCase = container.get<OpenSessionUseCase>(TYPES.OpenSessionUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (payload: IOpenSessionPayload) => await useCase.execute(payload),
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['cashRegisterCurrentSession'] });
			enqueueSnackbar(message || 'Caja abierta correctamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'No se pudo abrir la caja', { variant: 'error' });
		}
	});
}
