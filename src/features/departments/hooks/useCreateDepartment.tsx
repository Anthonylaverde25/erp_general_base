import { CreateDepartmentUseCase } from '@/application/use_cases/departments/CreateDepartmentUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ICreateDepartment } from '@/types/department.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useCreateDepartment() {
    const use_case = container.get<CreateDepartmentUseCase>(TYPES.CreateDepartmentUseCase);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const mutation = useMutation({
        mutationFn: (data: ICreateDepartment) => use_case.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            enqueueSnackbar('Departamento creado exitosamente', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error?.response?.data?.message || 'Error al crear departamento', {
                variant: 'error'
            });
            console.error(error);
        }
    });

    return {
        createDepartment: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error
    };
}
