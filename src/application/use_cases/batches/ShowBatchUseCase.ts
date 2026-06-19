import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { BatchEntity } from '@/domain/entities/batches/BatchEntity';
import type { IBatchRepository } from '@/domain/entities/batches/repositories/batch.interface.repository';

@injectable()
export class ShowBatchUseCase {
	constructor(
		@inject(TYPES.BatchRepository)
		private repository: IBatchRepository
	) {}

	async execute(id: number): Promise<BatchEntity> {
		return await this.repository.show(id);
	}
}
