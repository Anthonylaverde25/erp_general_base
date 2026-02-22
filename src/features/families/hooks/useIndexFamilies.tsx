import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexFamiliesUseCase } from '@/application/use_cases/families/IndexFamiliesUseCase';
import { FamilyEntity } from '@/domain/entities/families/FamilyEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexFamilies() {
	const useCase = container.get<IndexFamiliesUseCase>(TYPES.IndexFamiliesUseCase);
	const activeCompany = useActiveCompany();

	return useQuery<FamilyEntity[], Error>({
		queryKey: ['families', activeCompany?.id],
		queryFn: async () => await useCase.execute()
	});
}
