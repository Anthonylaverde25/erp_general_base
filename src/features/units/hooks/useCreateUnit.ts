import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateUnitUseCase } from '@/application/useCases/units/CreateUnitUseCase';
import { CreateUnitDTO } from '@/domain/entities/units/DTOs/UnitDTOs';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useCreateUnit() {
	const queryClient = useQueryClient();
	const useCase = container.get<CreateUnitUseCase>(TYPES.CreateUnitUseCase);
	const activeCompany = useActiveCompany();

	return useMutation({
		mutationFn: (data: CreateUnitDTO) => useCase.execute(data),
		onSuccess: () => {
			toast.success('Unit created successfully');
			queryClient.invalidateQueries({ queryKey: ['units', activeCompany?.id] });
		},
		onError: (error: Error) => {
			toast.error(`Error creating unit: ${error.message}`);
		}
	});
}
