import { IndexDocumentTypesByCategoryUseCase } from '@/application/use_cases/document_types/IndexDocumentTypesByCategoryUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useQuery } from '@tanstack/react-query';
import useActiveCompany from '@/features/companies/useActiveCompany';

export default function useIndexDocumentTypesByCategory(category: string) {
	const use_case = container.get<IndexDocumentTypesByCategoryUseCase>(TYPES.IndexDocumentTypesByCategoryUseCase);
	const activeCompany = useActiveCompany();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['document_types', 'category', category, activeCompany?.id],
		queryFn: async () => {
			return await use_case.execute(category);
		},
		enabled: !!activeCompany?.id && !!category
	});

	return {
		documentTypes: data,
		isLoading,
		isError,
		error
	};
}
