import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexUnitsUseCase } from '@/application/useCases/units/IndexUnitsUseCase';
import { UnitEntity } from '@/domain/entities/units/UnitEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexUnits() {
	const useCase = container.get<IndexUnitsUseCase>(TYPES.IndexUnitsUseCase);
	const activeCompany = useActiveCompany();

	const { data: units = [], isLoading } = useQuery<UnitEntity[], Error>({
		queryKey: ['units', activeCompany?.id],
		queryFn: () => useCase.execute(),
		enabled: !!activeCompany?.id
	});

	return { units, isLoading };
}
