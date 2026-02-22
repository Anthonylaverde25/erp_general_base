import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexUnitTypesUseCase } from '@/application/useCases/unit_types/IndexUnitTypesUseCase';
import { UnitTypeEntity } from '@/domain/entities/unit_types/UnitTypeEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexUnitTypes() {
	const useCase = container.get<IndexUnitTypesUseCase>(TYPES.IndexUnitTypesUseCase);
	const activeCompany = useActiveCompany();

	const { data: unitTypes = [], isLoading } = useQuery<UnitTypeEntity[], Error>({
		queryKey: ['unit-types', activeCompany?.id],
		queryFn: async () => await useCase.execute(),
		enabled: !!activeCompany?.id
	});

	return {
		unitTypes,
		isLoading
	};
}
