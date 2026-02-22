import type { IItemActionRepository } from '@/domain/entities/items/repositories/item.action.repository';
import type { ItemEntity } from '@/domain/entities/items/ItemEntity';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';

@injectable()
export class UpdateStockAlertUseCase {
	constructor(
		@inject(TYPES.IItemActionRepository)
		private readonly itemActionRepository: IItemActionRepository
	) {}

	async execute(
		id: number,
		data: { has_stock_alert: boolean; stock_min: number | null }
	): Promise<{ item: ItemEntity; message: string }> {
		return this.itemActionRepository.updateStockAlert(id, data);
	}
}
