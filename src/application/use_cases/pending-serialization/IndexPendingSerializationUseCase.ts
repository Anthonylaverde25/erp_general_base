import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IItemActionRepository } from '@/domain/entities/items/repositories/item.action.repository';
import type { PendingSerializationItem } from '@/types/pending-serialization.types';

@injectable()
export class IndexPendingSerializationUseCase {
	constructor(
		@inject(TYPES.IItemActionRepository)
		private repository: IItemActionRepository
	) {}

	async execute(): Promise<PendingSerializationItem[]> {
		return await this.repository.indexPendingSerialization();
	}
}
