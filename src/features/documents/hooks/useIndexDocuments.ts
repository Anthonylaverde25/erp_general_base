import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexDocumentsUseCase } from '@/application/use_cases/documents/IndexDocumentsUseCase';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexDocuments(filters: Record<string, any> = {}) {
    const useCase = container.get<IndexDocumentsUseCase>(TYPES.IndexDocumentsUseCase);
    const activeCompany = useActiveCompany();

    return useQuery<DocumentEntity[], Error>({
        queryKey: ['documents', filters, activeCompany?.id],
        queryFn: async () => await useCase.execute(filters)
    });
}
