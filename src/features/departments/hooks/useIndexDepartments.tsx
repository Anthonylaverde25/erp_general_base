import { IndexDepartmentsUseCase } from '@/application/use_cases/departments/IndexDepartmentsUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { useQuery } from '@tanstack/react-query';

export default function useIndexDepartments() {
    const use_case = container.get<IndexDepartmentsUseCase>(TYPES.IndexDepartmentsUseCase);
    const activeCompany = useActiveCompany()
    const query = useQuery({
        queryKey: ['departments', 'index', activeCompany?.id],
        queryFn: async () => use_case.execute()
    });

    return {
        departments: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch
    };
}
