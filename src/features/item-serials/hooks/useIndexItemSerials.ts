import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexItemSerialsUseCase } from '@/application/use_cases/items/IndexItemSerialsUseCase';
import { PaginatedItemSerials } from '@/types/item-serials.types';

export function useIndexItemSerials(
	page = 1,
	perPage = 15,
	filters?: {
		search?: string;
		status?: string;
		start_date?: string;
		end_date?: string;
		document_type?: string;
	}
) {
	const useCase = container.get<IndexItemSerialsUseCase>(TYPES.IndexItemSerialsUseCase);

	return useQuery<PaginatedItemSerials, Error>({
		queryKey: ['item-serials', page, perPage, filters],
		queryFn: () => useCase.execute(page, perPage, filters),
		refetchOnWindowFocus: false,
		placeholderData: (previousData) => previousData
	});
}
