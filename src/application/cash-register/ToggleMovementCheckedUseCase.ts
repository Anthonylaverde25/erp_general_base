import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICashRegisterRepository } from '@/domain/repositories/ICashRegisterRepository';

@injectable()
export class ToggleMovementCheckedUseCase {
	constructor(
		@inject(TYPES.ICashRegisterRepository)
		private readonly repository: ICashRegisterRepository
	) {}

	async execute(movementId: number): Promise<{ message?: string }> {
		return await this.repository.toggleMovementChecked(movementId);
	}
}
