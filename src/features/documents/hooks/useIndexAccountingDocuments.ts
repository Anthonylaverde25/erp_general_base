import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IDocumentRepository } from '@/domain/entities/documents/repositories/document.interface.repository';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexAccountingDocuments(filters: Record<string, any> = {}) {
    const repository = container.get<IDocumentRepository>(TYPES.IDocumentRepository);
    const activeCompany = useActiveCompany();

    return useQuery({
        queryKey: ['documents', 'accounting', filters, activeCompany?.id],
        queryFn: async () => await repository.indexAccounting(filters),
        placeholderData: (previousData) => previousData
    });
}
