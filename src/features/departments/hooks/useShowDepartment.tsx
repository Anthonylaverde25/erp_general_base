import { ShowDepartmentUseCase } from '@/application/use_cases/departments/ShowDepartmentUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useQuery } from '@tanstack/react-query';

export default function useShowDepartment(id: number | null) {
    const use_case = container.get<ShowDepartmentUseCase>(TYPES.ShowDepartmentUseCase);
    const query = useQuery({
        queryKey: ['departments', 'show', id],
        queryFn: async () => use_case.execute(id as number),
        enabled: !!id
    });

    return {
        department: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch
    };
}
