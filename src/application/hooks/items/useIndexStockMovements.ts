import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IItemActionRepository } from '@/domain/entities/items/repositories/item.action.repository';

export const useIndexStockMovements = (
	itemId?: number | null,
	page = 1,
	perPage = 15,
	filters?: { partner_id?: number | null; start_date?: string | null; end_date?: string | null },
	options?: { enabled?: boolean }
) => {
	const repository = container.get<IItemActionRepository>(TYPES.IItemActionRepository);

	return useQuery({
		queryKey: ['stock-movements', itemId, page, perPage, filters],
		queryFn: async () => {
			return await repository.indexStockMovements(itemId, page, perPage, filters);
		},
		enabled: options?.enabled ?? true,
		staleTime: 1000 * 60 * 5, // 5 minutos
		placeholderData: (previousData) => previousData // keep previous data while fetching next page
	});
};

