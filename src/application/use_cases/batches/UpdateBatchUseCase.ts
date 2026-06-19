import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { BatchEntity } from '@/domain/entities/batches/BatchEntity';
import type { IBatchRepository } from '@/domain/entities/batches/repositories/batch.interface.repository';
import { IUpdateBatch } from '@/types/batch.types';

@injectable()
export class UpdateBatchUseCase {
	constructor(
		@inject(TYPES.BatchRepository)
		private repository: IBatchRepository
	) {}

	async execute(id: number, data: IUpdateBatch): Promise<BatchEntity> {
		return await this.repository.update(id, data);
	}
}
