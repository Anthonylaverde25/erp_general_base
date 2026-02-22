import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type {
	IItemActionRepository,
	AdjustStockEntryDTO
} from '@/domain/entities/items/repositories/item.action.repository';

@injectable()
export class AdjustStockEntryUseCase {
	constructor(
		@inject(TYPES.IItemActionRepository)
		private repository: IItemActionRepository
	) {}

	async execute(data: AdjustStockEntryDTO): Promise<{ message: string; server_timestamp: string }> {
		return this.repository.adjustStockEntry(data);
	}
}
