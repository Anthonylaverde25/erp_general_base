import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ChangeDefaultContactUseCase } from '@/application/use_cases/companies/ChangeDefaultContactUseCase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { IContact } from '@/types/company.types';

export const useChangeDefaultContact = () => {
	const useCase = container.get<ChangeDefaultContactUseCase>(TYPES.ChangeDefaultContactUseCase);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (contactId: IContact['id']) => await useCase.execute(contactId),
		onSuccess: ({ message }) => {
			queryClient.invalidateQueries({ queryKey: ['company'] });
			toast.success(message, {
				description: `El contacto predeterminado fue cambiado exitosamente.`
			});
		},
		onError: (error) => {
			console.error('Error al cambiar el contacto predeterminado:', error);
		}
	});

	const handleChangeDefaultContact = (contactId: IContact['id']) => {
		return mutation.mutateAsync(contactId);
	};

	return {
		...mutation,
		handleChangeDefaultContact
	};
};
