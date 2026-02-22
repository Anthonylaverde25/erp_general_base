import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IItemActionRepository } from '@/domain/entities/items/repositories/item.action.repository';

export const useIndexStockMovements = (itemId: number, page = 1, perPage = 15, options?: { enabled?: boolean }) => {
	const repository = container.get<IItemActionRepository>(TYPES.IItemActionRepository);

	return useQuery({
		queryKey: ['stock-movements', itemId, page, perPage],
		queryFn: async () => {
			return await repository.indexStockMovements(itemId, page, perPage);
		},
		enabled: options?.enabled ?? true,
		staleTime: 1000 * 60 * 5, // 5 minutos
		placeholderData: (previousData) => previousData // keep previous data while fetching next page
	});
};
