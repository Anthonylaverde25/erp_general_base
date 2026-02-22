import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateCompanyUseCase } from '@/application/use_cases/companies/UpdateCompanyUseCase';
import { UpdateCompanyDTO } from '@/domain/entities/companies/DTOs/UpdateCompanyDTO';

export default function useUpdateCompany() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	const use_case = container.get<UpdateCompanyUseCase>(TYPES.UpdateCompanyUseCase);

	return useMutation({
		mutationFn: async ({ id, data }: { id: number; data: UpdateCompanyDTO }) => {
			// Pass DTO direclty to use case, repository handles FormData conversion
			return await use_case.execute({ id, data });
		},
		onSuccess: (response) => {
			// Invalidate company queries to refetch updated data
			queryClient.invalidateQueries({ queryKey: ['companies'] });
			queryClient.invalidateQueries({ queryKey: ['activeCompany'] });

			enqueueSnackbar(response.message || 'Empresa actualizada correctamente', {
				variant: 'success'
			});
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar la empresa', { variant: 'error' });
		}
	});
}
