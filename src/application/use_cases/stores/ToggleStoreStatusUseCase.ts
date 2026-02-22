import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IStoreActionRepository } from '@/domain/entities/stores/repositories/store.action.repository';
import { IUseCase } from '@/application/use_cases/IUseCase';

@injectable()
export class ToggleStoreStatusUseCase implements IUseCase<{ id: number; status: boolean }, void> {
	constructor(
		@inject(TYPES.IStoreActionRepository)
		private repository: IStoreActionRepository
	) {}

	async execute(params: { id: number; status: boolean }): Promise<void> {
		return this.repository.toggleStatus(params.id, params.status);
	}
}
