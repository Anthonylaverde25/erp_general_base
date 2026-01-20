import { CreateUserUseCase } from '@/application/use_cases/user/CreateUserUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateUserType } from '@/types/user.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useCreateUser() {
	const use_case = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: (data: CreateUserType) => use_case.execute(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al crear usuario', { variant: 'error' });
			console.error(error);
		}
	});

	const handleCreateUser = (data: CreateUserType) => {
		mutation.mutate(data);
	};

	return {
		handleCreateUser,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
