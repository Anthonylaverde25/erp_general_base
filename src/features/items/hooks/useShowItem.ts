import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ShowItemUseCase } from '@/application/use_cases/items/ShowItemUseCase';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';

export function useShowItem(id: number) {
	const useCase = container.get<ShowItemUseCase>(TYPES.ShowItemUseCase);

	const query = useQuery<ItemEntity, Error>({
		queryKey: ['items', id],
		queryFn: async () => await useCase.execute(id),
		enabled: !!id
	});

	return {
		item: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error
	};
}
