import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateItemUseCase } from '@/application/use_cases/items/CreateItemUseCase';
import { CreateItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';

export const useCreateItem = () => {
    const queryClient = useQueryClient();
    const createItemUseCase = container.get<CreateItemUseCase>(TYPES.CreateItemUseCase);

    const { mutateAsync: handleCreateItem, isPending: isLoading } = useMutation({
        mutationFn: (data: CreateItemDTO) => createItemUseCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });

    return {
        handleCreateItem,
        isLoading,
    };
};
