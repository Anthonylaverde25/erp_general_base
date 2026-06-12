import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexEmployeesUseCase } from '@/application/use_cases/employees/IndexEmployeesUseCase';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexEmployees(search?: string) {
	const useCase = container.get<IndexEmployeesUseCase>(TYPES.IndexEmployeesUseCase);
	const activeCompany = useActiveCompany();

	return useQuery<EmployeeEntity[], Error>({
		queryKey: ['employees', search, activeCompany?.id],
		queryFn: async () => await useCase.execute(search)
	});
}
