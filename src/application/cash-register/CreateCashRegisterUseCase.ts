import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import { ICreateCashRegisterPayload, ICashRegister } from '@/types/cash-register.types';

@injectable()
export class CreateCashRegisterUseCase {
	constructor(
		@inject(TYPES.ICashRegisterRepository)
		private readonly repository: ICashRegisterRepository
	) {}

	async execute(payload: ICreateCashRegisterPayload): Promise<{ message?: string; data?: ICashRegister }> {
		return await this.repository.create(payload);
	}
}
