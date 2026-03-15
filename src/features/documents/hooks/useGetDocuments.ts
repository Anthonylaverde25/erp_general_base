import { useQueries } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { GetDocumentUseCase } from '@/application/use_cases/documents/GetDocumentUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

/**
 * Hook to fetch multiple documents by their IDs.
 * Useful for grouping multiple delivery notes into a single invoice.
 */
export function useGetDocuments(ids: string[]) {
    const useCase = container.get<GetDocumentUseCase>(TYPES.GetDocumentUseCase);

    const queries = useQueries({
        queries: ids.map((id) => ({
            queryKey: ['document', id],
            queryFn: async () => await useCase.execute(id),
            enabled: !!id,
            staleTime: 1000 * 60 * 5, // 5 minutes
        })),
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);
    const data = queries.map((q) => q.data).filter((d): d is DocumentEntity => !!d);

    return {
        data,
        isLoading,
        isError,
    };
}
