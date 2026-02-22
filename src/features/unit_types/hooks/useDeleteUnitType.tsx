import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { DeleteUnitTypeUseCase } from '@/application/useCases/unit_types/DeleteUnitTypeUseCase';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { toast } from 'sonner';

export function useDeleteUnitType() {
	const queryClient = useQueryClient();
	const useCase = container.get<DeleteUnitTypeUseCase>(TYPES.DeleteUnitTypeUseCase);
	const activeCompany = useActiveCompany();

	return useMutation({
		mutationFn: (id: number) => useCase.execute(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['unit-types', activeCompany?.id] });
			toast.success('Tipo de unidad eliminado correctamente');
		},
		onError: (error) => {
			console.error(error);
			toast.error('Error al eliminar el tipo de unidad');
		}
	});
}
