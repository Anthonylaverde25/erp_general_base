import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ConvertToPurchaseUseCase } from '@/application/use_cases/documents/ConvertToPurchaseUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

/**
 * Mutation hook that calls POST /documents/{id}/convert-to-purchase.
 * This hook is used to create a Draft Purchase Order from a Sales Quote.
 */
export function useConvertToPurchase() {
    const useCase = container.get<ConvertToPurchaseUseCase>(TYPES.ConvertToPurchaseUseCase);
    const queryClient = useQueryClient();

    return useMutation<DocumentEntity, Error, { id: string }>({
        mutationFn: ({ id }) => useCase.execute(id),
        onSuccess: (_purchaseOrder) => {
            // Refresh the documents list since a new one was created
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
}
