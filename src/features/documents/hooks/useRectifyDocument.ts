import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { RectifyDocumentUseCase } from '@/application/use_cases/documents/RectifyDocumentUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

/**
 * Mutation hook that calls POST /documents/{id}/rectify.
 * On success, it invalidates the queries for the source document and documents list.
 */
export function useRectifyDocument() {
    const useCase = container.get<RectifyDocumentUseCase>(TYPES.RectifyDocumentUseCase);
    const queryClient = useQueryClient();

    return useMutation<DocumentEntity, Error, { id: string; payload?: { 
        number_series_id?: number | ''; 
        reason_id?: number;
        rectification_type_id?: number;
        rectification_modality_id?: number;
        notes?: string;
    } }>({
        mutationFn: ({ id, payload }) => useCase.execute(id, payload),
        onSuccess: (_rectified, variables) => {
            // Refresh the source document (now in 'cancelled' state)
            queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
            // Refresh the documents list
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
}
