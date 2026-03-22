import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateDocumentUseCase } from '@/application/use_cases/documents/UpdateDocumentUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

export function useUpdateDocument() {
    const useCase = container.get<UpdateDocumentUseCase>(TYPES.UpdateDocumentUseCase);
    const queryClient = useQueryClient();

    return useMutation<DocumentEntity, Error, { id: string; data: any }>({
        mutationFn: async ({ id, data }) => await useCase.execute(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document', String(variables.id)] });
            queryClient.invalidateQueries({ queryKey: ['number_series'] });
        }
    });
}
