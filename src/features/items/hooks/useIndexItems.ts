import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexItemsUseCase } from '@/application/use_cases/items/IndexItemsUseCase';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';

export const useIndexItems = () => {
    return useQuery<ItemEntity[], Error>({
        queryKey: ['items'],
        queryFn: async () => {
            const useCase = container.get<IndexItemsUseCase>(TYPES.IndexItemsUseCase);
            return await useCase.execute();
        }
    });
};
