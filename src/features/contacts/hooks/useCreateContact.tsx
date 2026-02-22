import { CreateContactUseCase } from '@/application/use_cases/contacts/CreateContactUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateContactDTO } from '@/domain/entities/contacts/DTOs/CreateContactDTO';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useCreateContact() {
	const use_case = container.get<CreateContactUseCase>(TYPES.CreateContactUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: async ({ companyId, data }: { companyId: number; data: CreateContactDTO }) => {
			const { contact, message } = await use_case.execute({ companyId, data });
			return { contact, message };
		},
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['contacts'] });
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });
			enqueueSnackbar(message || 'Contacto creado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al crear contacto', { variant: 'error' });
			console.error(error);
		}
	});

	const handleCreateContact = (companyId: number, data: CreateContactDTO) => {
		mutation.mutate({ companyId, data });
	};

	return {
		handleCreateContact,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		isSuccess: mutation.isSuccess
	};
}
