import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexItemReturnReasonsUseCase } from '@/application/use_cases/serial-returns/IndexItemReturnReasonsUseCase';
import { ItemReturnReasonEntity } from '@/domain/entities/serial-returns/ItemReturnReasonEntity';

export function useIndexItemReturnReasons() {
	const useCase = container.get<IndexItemReturnReasonsUseCase>(TYPES.IndexItemReturnReasonsUseCase);

	return useQuery<ItemReturnReasonEntity[], Error>({
		queryKey: ['item-return-reasons'],
		queryFn: () => useCase.execute(),
		refetchOnWindowFocus: false
	});
}
