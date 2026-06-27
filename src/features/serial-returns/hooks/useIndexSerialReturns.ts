import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexSerialReturnsUseCase } from '@/application/use_cases/serial-returns/IndexSerialReturnsUseCase';
import { ItemSerialReturnEntity } from '@/domain/entities/serial-returns/ItemSerialReturnEntity';

export function useIndexSerialReturns(filters: Record<string, any> = {}) {
	const useCase = container.get<IndexSerialReturnsUseCase>(TYPES.IndexSerialReturnsUseCase);

	return useQuery<ItemSerialReturnEntity[], Error>({
		queryKey: ['serial-returns', filters],
		queryFn: () => useCase.execute(filters),
		refetchOnWindowFocus: false,
		placeholderData: (previousData) => previousData
	});
}
