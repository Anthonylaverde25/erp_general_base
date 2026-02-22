import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexTaxTypesUseCase } from '@/application/use_cases/tax_types/IndexTaxTypesUseCase';

export default function useIndexTaxTypes() {
	const use_case = container.get<IndexTaxTypesUseCase>(TYPES.IndexTaxTypesUseCase);

	const {
		data: taxTypes,
		isLoading,
		isError
	} = useQuery({
		queryKey: ['tax-types'],
		queryFn: async () => await use_case.execute()
	});

	return { taxTypes, isLoading, isError };
}
