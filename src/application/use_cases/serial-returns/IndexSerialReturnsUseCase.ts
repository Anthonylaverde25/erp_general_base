import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { ItemSerialReturnEntity } from '@/domain/entities/serial-returns/ItemSerialReturnEntity';
import type { ISerialReturnRepository } from '@/domain/entities/serial-returns/repositories/serial-returns.interface.repository';

@injectable()
export class IndexSerialReturnsUseCase {
	constructor(
		@inject(TYPES.SerialReturnRepository)
		private repository: ISerialReturnRepository
	) {}

	async execute(filters?: Record<string, any>): Promise<ItemSerialReturnEntity[]> {
		return await this.repository.index(filters);
	}
}
