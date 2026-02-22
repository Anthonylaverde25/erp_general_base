import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFamilyActionRepository } from '@/domain/entities/families/repositories/family.action.repository';
import { IUseCase } from '../IUseCase';

@injectable()
export class ToggleFamilyStatusUseCase implements IUseCase<{ id: number; status: boolean }, void> {
	constructor(
		@inject(TYPES.IFamilyActionRepository)
		private repository: IFamilyActionRepository
	) {}

	async execute(params: { id: number; status: boolean }): Promise<void> {
		return this.repository.toggleStatus(params.id, params.status);
	}
}
