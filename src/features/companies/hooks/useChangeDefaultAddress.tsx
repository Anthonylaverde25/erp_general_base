import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ChangeDefaultAddressUseCase } from '@/application/use_cases/companies/ChangeDefaultAddressUseCase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { IAddress } from '@/types/company.types';

export const useChangeDefaultAddress = () => {
	const useCase = container.get<ChangeDefaultAddressUseCase>(TYPES.ChangeDefaultAddressUseCase); // Note: I need to add this symbol first if it doesn't exist, or just instantiate it if not bound with symbol. Wait, typically UseCases are bound.
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (addressId: IAddress['id']) => await useCase.execute(addressId),
		onSuccess: ({ message, status }) => {
			queryClient.invalidateQueries({ queryKey: ['company'] });
			toast.success(message, {
				description: `La dirección predeterminada fue cambiada exitosamente.`
			});
		},
		onError: (error) => {
			console.error('Error al cambiar la dirección predeterminada:', error);
		}
	});

	const handleChangeDefaultAddress = (addressId: IAddress['id']) => {
		return mutation.mutateAsync(addressId);
	};

	return {
		...mutation,
		handleChangeDefaultAddress
	};
};
