import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateAddressUseCase } from '@/application/use_cases/companies/CreateAddressUseCase';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { toast } from 'sonner';

interface CreateAddressParams {
	companyId: number;
	data: CreateAddressDTO;
}

export const useCreateAddressToCompany = () => {
	const queryClient = useQueryClient();
	const createAddressUseCase = container.get<CreateAddressUseCase>(TYPES.CreateAddressUseCase);

	const mutation = useMutation({
		mutationFn: async ({ companyId, data }: CreateAddressParams) => {
			return await createAddressUseCase.execute({ companyId, data });
		},
		onSuccess: ({ message, address }, variables) => {
			toast.success(message);
			queryClient.invalidateQueries({ queryKey: ['activeCompany', { id: variables.companyId }] });
		},
		onError: (error: any) => {
			console.error(error);
			toast.error('Error al crear la dirección');
		}
	});

	const handleCreateAddressToCompany = (companyId: number, data: CreateAddressDTO) => {
		return mutation.mutateAsync({ companyId, data });
	};

	return {
		handleCreateAddressToCompany,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
};
