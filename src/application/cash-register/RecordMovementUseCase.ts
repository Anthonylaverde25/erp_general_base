import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import { IRecordMovementPayload } from '@/types/cash-register.types';

@injectable()
export class RecordMovementUseCase {
	constructor(
		@inject(TYPES.ICashRegisterRepository)
		private readonly repository: ICashRegisterRepository
	) {}

	async execute(payload: IRecordMovementPayload): Promise<{ message?: string }> {
		return await this.repository.recordMovement(payload);
	}
}
