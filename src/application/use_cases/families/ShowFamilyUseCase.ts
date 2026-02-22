import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFamilyRepository } from '@/domain/entities/families/repositories/families.interface.repository';
import { FamilyEntity } from '@/domain/entities/families/FamilyEntity';

@injectable()
export class ShowFamilyUseCase {
	constructor(
		@inject(TYPES.FamilyRepository)
		private repository: IFamilyRepository
	) {}

	async execute(id: number): Promise<FamilyEntity> {
		return await this.repository.show(id);
	}
}
