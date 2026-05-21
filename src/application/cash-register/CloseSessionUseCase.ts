import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import { ICloseSessionPayload } from '@/types/cash-register.types';

@injectable()
export class CloseSessionUseCase {
	constructor(
		@inject(TYPES.ICashRegisterRepository)
		private readonly repository: ICashRegisterRepository
	) {}

	async execute(payload: ICloseSessionPayload): Promise<{ message?: string }> {
		return await this.repository.closeSession(payload);
	}
}
