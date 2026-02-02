import { IndexUserUseCase } from '@/application/use_cases/user/IndexUserUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { useQuery } from '@tanstack/react-query';

export default function useIndexUser() {
	const use_case = container.get<IndexUserUseCase>(TYPES.IndexUserUseCase);
	const activeCompany = useActiveCompany();

	const query = useQuery({
		queryKey: ['users', activeCompany?.id],
		queryFn: () => use_case.execute(),
		refetchOnWindowFocus: false,
		placeholderData: (previousData) => previousData,
		// staleTime: 5 * 60 * 1000,
	});

	return {
		users: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error
	};
}
