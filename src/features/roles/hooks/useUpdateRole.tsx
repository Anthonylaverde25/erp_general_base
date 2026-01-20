import { UpdateRoleUseCase } from '@/application/use_cases/roles/UpdateRoleUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateRoleType } from '@/types/role.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateRole() {
    const use_case = container.get<UpdateRoleUseCase>(TYPES.UpdateRoleUseCase);
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRoleType }) => use_case.execute(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            enqueueSnackbar('Rol actualizado exitosamente', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar rol', { variant: 'error' });
            console.error(error);
        }
    });

    const handleUpdateRole = (id: number, data: UpdateRoleType) => {
        mutation.mutate({ id, data });
    };

    return {
        handleUpdateRole,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error
    };
}
