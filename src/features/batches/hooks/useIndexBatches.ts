import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexBatchesUseCase } from '@/application/use_cases/batches/IndexBatchesUseCase';
import { BatchEntity } from '@/domain/entities/batches/BatchEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexBatches(filters: Record<string, any> = {}) {
	const useCase = container.get<IndexBatchesUseCase>(TYPES.IndexBatchesUseCase);
	const activeCompany = useActiveCompany();

	return useQuery<{ data: BatchEntity[]; meta: any }, Error>({
		queryKey: ['batches', filters, activeCompany?.id],
		queryFn: async () => await useCase.execute(filters),
		placeholderData: (previousData) => previousData
	});
}
