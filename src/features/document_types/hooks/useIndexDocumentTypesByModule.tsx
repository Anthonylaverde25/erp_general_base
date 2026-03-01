import { IndexDocumentTypesByModuleUseCase } from '@/application/use_cases/document_types/IndexDocumentTypesByModuleUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useQuery } from '@tanstack/react-query';
import useActiveCompany from '@/features/companies/useActiveCompany';

export default function useIndexDocumentTypesByModule(module: string) {
    const use_case = container.get<IndexDocumentTypesByModuleUseCase>(TYPES.IndexDocumentTypesByModuleUseCase);
    const activeCompany = useActiveCompany();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['document_types', 'module', module, activeCompany?.id],
        queryFn: async () => {
            return await use_case.execute(module);
        },
        enabled: !!activeCompany?.id && !!module
    });

    return {
        documentTypes: data,
        isLoading,
        isError,
        error
    };
}
