import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateCashRegisterUseCase } from '@/application/cash-register/CreateCashRegisterUseCase';
import { ICreateCashRegisterPayload } from '@/types/cash-register.types';

export default function useCreateCashRegister() {
	const useCase = container.get<CreateCashRegisterUseCase>(TYPES.CreateCashRegisterUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: async (payload: ICreateCashRegisterPayload) => await useCase.execute(payload),
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['cashRegisters'] });
			enqueueSnackbar(message || 'Caja registradora creada correctamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'No se pudo crear la caja registradora', { variant: 'error' });
		}
	});
}
