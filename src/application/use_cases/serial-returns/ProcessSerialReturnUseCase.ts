import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { ItemSerialReturnEntity } from '@/domain/entities/serial-returns/ItemSerialReturnEntity';
import { IProcessSerialReturnPayload } from '@/types/serial-returns.types';
import type { ISerialReturnRepository } from '@/domain/entities/serial-returns/repositories/serial-returns.interface.repository';

@injectable()
export class ProcessSerialReturnUseCase {
	constructor(
		@inject(TYPES.SerialReturnRepository)
		private repository: ISerialReturnRepository
	) {}

	async execute(id: number, payload: IProcessSerialReturnPayload): Promise<ItemSerialReturnEntity> {
		return await this.repository.process(id, payload);
	}
}
