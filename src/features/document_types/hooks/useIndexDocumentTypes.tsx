import { IndexDocumentTypesUseCase } from "@/application/use_cases/document_types/IndexDocumentTypesUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useQuery } from "@tanstack/react-query";

export default function useIndexDocumentTypes() {
    const use_case = container.get<IndexDocumentTypesUseCase>(TYPES.IndexDocumentTypesUseCase);
    const activeCompany = useActiveCompany();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["document_types", activeCompany?.id],
        queryFn: async () => {
            return await use_case.execute();
        },
        enabled: !!activeCompany?.id,
    });

    return {
        documentTypes: data,
        isLoading,
        isError,
        error,
    };
}
