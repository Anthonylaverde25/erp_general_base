import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type {
	IItemActionRepository,
	RegisterStockMovementDTO
} from '@/domain/entities/items/repositories/item.action.repository';

@injectable()
export class RegisterStockMovementUseCase {
	constructor(
		@inject(TYPES.IItemActionRepository)
		private repository: IItemActionRepository
	) {}

	async execute(data: RegisterStockMovementDTO): Promise<{ message: string }> {
		return this.repository.registerStockMovement(data);
	}
}
