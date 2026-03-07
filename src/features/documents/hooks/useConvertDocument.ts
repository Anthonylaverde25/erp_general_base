import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ConvertDocumentUseCase } from '@/application/use_cases/documents/ConvertDocumentUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

/**
 * Mutation hook that calls POST /documents/{id}/convert.
 * On success it invalidates the source document's query so its status
 * updates to 'invoiced' in the UI automatically.
 */
export function useConvertDocument() {
    const useCase = container.get<ConvertDocumentUseCase>(TYPES.ConvertDocumentUseCase);
    const queryClient = useQueryClient();

    return useMutation<DocumentEntity, Error, { id: string; payload?: { number_series_id?: number | ''; status_key?: string } }>({
        mutationFn: ({ id, payload }) => useCase.execute(id, payload),
        onSuccess: (_invoice, variables) => {
            // Refresh the source delivery note (now in 'invoiced' state)
            queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
            // Refresh the documents list
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
}
