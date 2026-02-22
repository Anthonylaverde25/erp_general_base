import { UpdateRoleUseCase } from '@/application/use_cases/roles/UpdateRoleUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IUpdateRole } from '@/types/role.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateRole() {
	const use_case = container.get<UpdateRoleUseCase>(TYPES.UpdateRoleUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: (data: { id: number; payload: IUpdateRole }) => use_case.execute(data.id, data.payload),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['roles'] });
			queryClient.invalidateQueries({ queryKey: ['role', id] });
			enqueueSnackbar('Rol actualizado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar rol', { variant: 'error' });
			console.error(error);
		}
	});

	const handleUpdateRole = (id: number, payload: IUpdateRole) => {
		mutation.mutate({ id, payload });
	};

	return {
		handleUpdateRole,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
