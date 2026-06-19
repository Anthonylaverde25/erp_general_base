import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { BatchEntity } from '@/domain/entities/batches/BatchEntity';
import type { IBatchRepository } from '@/domain/entities/batches/repositories/batch.interface.repository';

@injectable()
export class IndexBatchesUseCase {
	constructor(
		@inject(TYPES.BatchRepository)
		private repository: IBatchRepository
	) {}

	async execute(filters?: Record<string, any>): Promise<{ data: BatchEntity[]; meta: any }> {
		return await this.repository.index(filters);
	}
}
