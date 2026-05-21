import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';
import { ICashRegister } from '@/types/cash-register.types';

@injectable()
export class IndexCashRegistersUseCase {
	constructor(
		@inject(TYPES.ICashRegisterRepository)
		private readonly repository: ICashRegisterRepository
	) {}

	async execute(): Promise<ICashRegister[]> {
		return await this.repository.index();
	}
}
