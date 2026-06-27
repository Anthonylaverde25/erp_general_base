import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IItemActionRepository } from '@/domain/entities/items/repositories/item.action.repository';
import type { RegisterSerialsPayload } from '@/types/pending-serialization.types';

@injectable()
export class RegisterItemSerialsUseCase {
	constructor(
		@inject(TYPES.IItemActionRepository)
		private repository: IItemActionRepository
	) {}

	async execute(id: number, payload: RegisterSerialsPayload): Promise<{ message: string }> {
		return await this.repository.registerItemSerials(id, payload);
	}
}
