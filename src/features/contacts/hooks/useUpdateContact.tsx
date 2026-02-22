import { UpdateContactUseCase } from '@/application/use_cases/contacts/UpdateContactUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ContactEntity } from '@/domain/entities/contacts/Contact';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateContact() {
	const use_case = container.get<UpdateContactUseCase>(TYPES.UpdateContactUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async ({ id, data }: { id: number; data: Partial<ContactEntity> }) => {
			const { contact, message } = await use_case.execute({ id, data });
			return { contact, message };
		},
		onSuccess: ({ message }, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['contacts'] });
			queryClient.invalidateQueries({ queryKey: ['contacts', id] });
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });
			enqueueSnackbar(message || 'Contacto actualizado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar contacto', { variant: 'error' });
			console.error(error);
		}
	});

	const handleUpdateContact = (id: number, data: Partial<ContactEntity>) => {
		mutation.mutate({ id, data });
	};

	return {
		handleUpdateContact,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
