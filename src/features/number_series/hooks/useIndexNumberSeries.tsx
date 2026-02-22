import { IndexNumberSeriesUseCase } from '@/application/use_cases/number_series/IndexNumberSeriesUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import useActiveCompany from '@/features/companies/useActiveCompany';
import { useQuery } from '@tanstack/react-query';

export default function useIndexNumberSeries() {
	const use_case = container.get<IndexNumberSeriesUseCase>(TYPES.IndexNumberSeriesUseCase);
	const activeCompany = useActiveCompany();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['number_series', activeCompany?.id],
		queryFn: async () => {
			return await use_case.execute();
		},
		enabled: !!activeCompany?.id
	});

	return {
		numberSeries: data,
		isLoading,
		isError,
		error
	};
}
