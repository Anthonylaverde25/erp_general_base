import { AssociateEmployeesUseCase } from '@/application/use_cases/users/AssociateEmployeesUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export default function useAssociateEmployees() {
	const use_case = container.get<AssociateEmployeesUseCase>(TYPES.AssociateEmployeesUseCase);
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: ({ id, employeeIds }: { id: number; employeeIds: number[] }) => use_case.execute(id, employeeIds),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['user', id] });
			enqueueSnackbar('Empleados asociados exitosamente', { variant: 'success' });
		},
		onError: (error: any) => {
			enqueueSnackbar(error?.response?.data?.message || 'Error al asociar empleados', { variant: 'error' });
			console.error(error);
		}
	});

	const handleAssociateEmployees = async (id: number, employeeIds: number[]) => {
		return mutation.mutateAsync({ id, employeeIds });
	};

	return {
		handleAssociateEmployees,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
