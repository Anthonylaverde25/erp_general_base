import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { ItemReturnReasonEntity } from '@/domain/entities/serial-returns/ItemReturnReasonEntity';
import type { ISerialReturnRepository } from '@/domain/entities/serial-returns/repositories/serial-returns.interface.repository';

@injectable()
export class IndexItemReturnReasonsUseCase {
	constructor(
		@inject(TYPES.SerialReturnRepository)
		private repository: ISerialReturnRepository
	) {}

	async execute(): Promise<ItemReturnReasonEntity[]> {
		return await this.repository.listReasons();
	}
}
