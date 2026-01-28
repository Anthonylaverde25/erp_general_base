import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateCompanyUseCase } from '@/application/use_cases/company/UpdateCompanyUseCase';
import { Company, UpdateCompanyType } from '@/domain/entities/companies/Company';

export default function useUpdateCompany() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const use_case = container.get<UpdateCompanyUseCase>(TYPES.UpdateCompanyUseCase);

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateCompanyType }) => {
            const companyEntity = Company.update(id, data);
            return await use_case.execute({ id, data: companyEntity });
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
            enqueueSnackbar(
                error?.response?.data?.message || 'Error al actualizar la empresa',
                { variant: 'error' }
            );
        },
    });
}
