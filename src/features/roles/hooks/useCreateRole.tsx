import { CreateRoleUseCase } from '@/application/use_cases/roles/CreateRoleUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ICreateRole } from '@/types/role.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useCreateRole() {
	const use_case = container.get<CreateRoleUseCase>(TYPES.CreateRoleUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: (data: ICreateRole) => use_case.execute(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] });
			enqueueSnackbar('Rol creado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al crear rol', {
				variant: 'error'
			});
			console.error(error);
		}
	});

	const handleCreateRole = (data: ICreateRole) => {
		mutation.mutateAsync(data);
	};

	return {
		handleCreateRole,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
