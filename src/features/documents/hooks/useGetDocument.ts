import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { GetDocumentUseCase } from '@/application/use_cases/documents/GetDocumentUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

export function useGetDocument(id: string) {
    const useCase = container.get<GetDocumentUseCase>(TYPES.GetDocumentUseCase);

    return useQuery<DocumentEntity, Error>({
        queryKey: ['document', id],
        queryFn: async () => await useCase.execute(id),
        enabled: !!id
    });
}
