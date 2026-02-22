import { UpdateAddressUseCase } from '@/application/use_cases/addresses/UpdateAddressUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { AddressEntity } from '@/domain/entities/addresses/Address';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateAddress() {
	const use_case = container.get<UpdateAddressUseCase>(TYPES.UpdateAddressUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async ({ id, data }: { id: number; data: Partial<AddressEntity> }) => {
			const { address, message } = await use_case.execute({ id, data });
			return { address, message };
		},
		onSuccess: ({ message }, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['addresses'] });
			queryClient.invalidateQueries({ queryKey: ['addresses', id] });
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });

			enqueueSnackbar(message || 'Dirección actualizada exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar dirección', { variant: 'error' });
			console.error(error);
		}
	});

	const handleUpdateAddress = (id: number, data: Partial<AddressEntity>) => {
		mutation.mutate({ id, data });
	};

	return {
		handleUpdateAddress,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
