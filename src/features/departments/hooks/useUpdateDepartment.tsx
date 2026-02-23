import { UpdateDepartmentUseCase } from '@/application/use_cases/departments/UpdateDepartmentUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IUpdateDepartment } from '@/types/department.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateDepartment() {
    const use_case = container.get<UpdateDepartmentUseCase>(TYPES.UpdateDepartmentUseCase);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: IUpdateDepartment }) => use_case.execute(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            queryClient.invalidateQueries({ queryKey: ['departments', variables.id] });
            enqueueSnackbar('Departamento actualizado exitosamente', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar departamento', {
                variant: 'error'
            });
            console.error(error);
        }
    });

    return {
        updateDepartment: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error
    };
}
