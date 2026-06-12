import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateEmployeeUseCase } from '@/application/use_cases/employees/UpdateEmployeeUseCase';
import { UpdateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';
import { toast } from 'sonner';

export function useUpdateEmployee() {
	const queryClient = useQueryClient();
	const useCase = container.get<UpdateEmployeeUseCase>(TYPES.UpdateEmployeeUseCase);

	const mutation = useMutation<
		{ employee: EmployeeEntity; message: string },
		Error,
		{ id: number; data: UpdateEmployeeDTO }
	>({
		mutationFn: async ({ id, data }) => await useCase.execute(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
			toast.success(data.message || 'Empleado actualizado exitosamente');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Error al actualizar empleado');
			console.error(error);
		}
	});

	const handleUpdateEmployee = async (id: number, data: UpdateEmployeeDTO) => {
		return await mutation.mutateAsync({ id, data });
	};

	return {
		handleUpdateEmployee,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
