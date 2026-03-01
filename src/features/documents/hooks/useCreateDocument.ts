import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateDocumentUseCase } from '@/application/use_cases/documents/CreateDocumentUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

export function useCreateDocument() {
    const useCase = container.get<CreateDocumentUseCase>(TYPES.CreateDocumentUseCase);
    const queryClient = useQueryClient();

    return useMutation<DocumentEntity, Error, any>({
        mutationFn: async (data: any) => await useCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        }
    });
}
