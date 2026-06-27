import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexPendingSerializationUseCase } from '@/application/use_cases/pending-serialization/IndexPendingSerializationUseCase';
import { PendingSerializationItem } from '@/types/pending-serialization.types';

export function useIndexPendingSerialization() {
	const useCase = container.get<IndexPendingSerializationUseCase>(TYPES.IndexPendingSerializationUseCase);

	return useQuery<PendingSerializationItem[], Error>({
		queryKey: ['pending-serialization'],
		queryFn: () => useCase.execute(),
		refetchOnWindowFocus: false,
		placeholderData: (previousData) => previousData
	});
}
