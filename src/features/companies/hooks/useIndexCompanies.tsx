import { IndexCompanyUseCase } from '@/application/use_cases/companies/IndexCompanyUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useQuery } from '@tanstack/react-query';

export default function useIndexCompanies() {
	const use_case = container.get<IndexCompanyUseCase>(TYPES.IndexCompanyUseCase);

	const query = useQuery({
		queryKey: ['companies'],
		queryFn: () => use_case.execute(),
		refetchOnWindowFocus: false
	});

	return {
		companies: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error
	};
}
