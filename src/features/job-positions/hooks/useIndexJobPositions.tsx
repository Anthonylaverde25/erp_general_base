import { IndexJobPositionsUseCase } from '@/application/use_cases/job_positions/IndexJobPositionsUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useQuery } from '@tanstack/react-query';

export default function useIndexJobPositions(departmentId?: number | null) {
	const use_case = container.get<IndexJobPositionsUseCase>(TYPES.IndexJobPositionsUseCase);

	const query = useQuery({
		queryKey: ['job-positions', 'index', departmentId],
		queryFn: async () => use_case.execute(departmentId)
	});

	return {
		jobPositions: query.data || [],
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch
	};
}
