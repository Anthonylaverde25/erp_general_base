import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateEmployeeUseCase } from '@/application/use_cases/employees/CreateEmployeeUseCase';
import { CreateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';
import { toast } from 'sonner';

export function useCreateEmployee() {
	const queryClient = useQueryClient();
	const useCase = container.get<CreateEmployeeUseCase>(TYPES.CreateEmployeeUseCase);

	const mutation = useMutation<{ employee: EmployeeEntity; message: string }, Error, CreateEmployeeDTO>({
		mutationFn: async (data: CreateEmployeeDTO) => await useCase.execute(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			toast.success(data.message || 'Empleado creado exitosamente');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Error al crear empleado');
			console.error(error);
		}
	});

	const handleCreateEmployee = async (data: CreateEmployeeDTO) => {
		return await mutation.mutateAsync(data);
	};

	return {
		handleCreateEmployee,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error
	};
}
