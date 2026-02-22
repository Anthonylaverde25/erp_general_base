import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexCurrenciesUseCase } from '@/application/use_cases/currencies/IndexCurrenciesUseCase';

export default function useIndexCurrencies() {
	const use_case = container.get<IndexCurrenciesUseCase>(TYPES.IndexCurrenciesUseCase);

	const {
		data: currencies,
		isLoading,
		isError
	} = useQuery({
		queryKey: ['currencies'],
		queryFn: async () => await use_case.execute()
	});

	return { currencies, isLoading, isError };
}
