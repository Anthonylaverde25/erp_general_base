import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { DeleteEmployeeUseCase } from '@/application/use_cases/employees/DeleteEmployeeUseCase';
import { toast } from 'sonner';

export function useDeleteEmployee() {
	const queryClient = useQueryClient();
	const useCase = container.get<DeleteEmployeeUseCase>(TYPES.DeleteEmployeeUseCase);

	const mutation = useMutation<{ success: boolean; message?: string }, Error, number>({
		mutationFn: async (id: number) => {
			await useCase.execute(id);
			return { success: true, message: 'Empleado eliminado exitosamente' };
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			toast.success(data.message || 'Empleado eliminado exitosamente');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Error al eliminar empleado');
			console.error(error);
		}
	});

	const handleDeleteEmployee = async (id: number) => {
		return await mutation.mutateAsync(id);
	};

	return {
		handleDeleteEmployee,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
