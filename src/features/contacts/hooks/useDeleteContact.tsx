import { DeleteContactUseCase } from '@/application/use_cases/contacts/DeleteContactUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useDeleteContact() {
	const use_case = container.get<DeleteContactUseCase>(TYPES.DeleteContactUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async (id: number) => {
			await use_case.execute(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['contacts'] });
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });
			enqueueSnackbar('Contacto eliminado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al eliminar contacto', { variant: 'error' });
			console.error(error);
		}
	});

	const handleDeleteContact = (id: number) => {
		mutation.mutate(id);
	};

	return {
		handleDeleteContact,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
