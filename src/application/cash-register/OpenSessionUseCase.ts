import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import { IOpenSessionPayload } from '@/types/cash-register.types';

@injectable()
export class OpenSessionUseCase {
	constructor(
		@inject(TYPES.ICashRegisterRepository)
		private readonly repository: ICashRegisterRepository
	) {}

	async execute(payload: IOpenSessionPayload): Promise<{ message?: string }> {
		return await this.repository.openSession(payload);
	}
}
