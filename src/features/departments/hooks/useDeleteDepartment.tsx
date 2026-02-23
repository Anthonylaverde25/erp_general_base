import { DeleteDepartmentUseCase } from '@/application/use_cases/departments/DeleteDepartmentUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useDeleteDepartment() {
    const use_case = container.get<DeleteDepartmentUseCase>(TYPES.DeleteDepartmentUseCase);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const mutation = useMutation({
        mutationFn: (id: number) => use_case.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            enqueueSnackbar('Departamento eliminado exitosamente', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error?.response?.data?.message || 'Error al eliminar departamento', {
                variant: 'error'
            });
            console.error(error);
        }
    });

    return {
        deleteDepartment: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error
    };
}
