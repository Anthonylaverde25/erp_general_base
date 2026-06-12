import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ShowEmployeeUseCase } from '@/application/use_cases/employees/ShowEmployeeUseCase';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';

export function useShowEmployee(id: number) {
	const useCase = container.get<ShowEmployeeUseCase>(TYPES.ShowEmployeeUseCase);

	return useQuery<EmployeeEntity, Error>({
		queryKey: ['employees', id],
		queryFn: async () => await useCase.execute(id),
		enabled: !!id
	});
}
