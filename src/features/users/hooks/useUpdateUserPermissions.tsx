import { UpdateUserPermissionsUseCase } from '@/application/use_cases/users/UpdateUserPermissionsUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateUserPermissions() {
	const use_case = container.get<UpdateUserPermissionsUseCase>(TYPES.UpdateUserPermissionsUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: ({ id, permissions }: { id: number; permissions: { id: number; allowed: boolean | null }[] }) =>
			use_case.execute(id, permissions),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['user', id] });
			enqueueSnackbar('Permisos actualizados exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar permisos', { variant: 'error' });
			console.error(error);
		}
	});

	const handleUpdateUserPermissions = async (id: number, permissions: { id: number; allowed: boolean | null }[]) => {
		return mutation.mutateAsync({ id, permissions });
	};

	return {
		handleUpdateUserPermissions,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
