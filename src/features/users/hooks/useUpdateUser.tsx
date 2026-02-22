import { UpdateUserUseCase } from '@/application/use_cases/users/UpdateUserUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IUpdateUser } from '@/types/user.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useUpdateUser() {
	const use_case = container.get<UpdateUserUseCase>(TYPES.UpdateUserUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: IUpdateUser }) => use_case.execute(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['user', id] });
			enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar usuario', { variant: 'error' });
			console.error(error);
		}
	});

	const handleUpdateUser = (id: number, data: IUpdateUser) => {
		mutation.mutate({ id, data });
	};

	return {
		handleUpdateUser,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
