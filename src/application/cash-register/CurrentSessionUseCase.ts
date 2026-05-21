import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import { ICashRegisterCurrentSession } from '@/types/cash-register.types';

@injectable()
export class CurrentSessionUseCase {
	constructor(
		@inject(TYPES.ICashRegisterRepository)
		private readonly repository: ICashRegisterRepository
	) {}

	async execute(): Promise<ICashRegisterCurrentSession> {
		return await this.repository.currentSession();
	}
}
