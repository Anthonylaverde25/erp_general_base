import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFamilyRepository } from '@/domain/entities/families/repositories/families.interface.repository';
import { FamilyEntity, Family } from '@/domain/entities/families/FamilyEntity';

@injectable()
export class UpdateFamilyUseCase {
	constructor(
		@inject(TYPES.FamilyRepository)
		private repository: IFamilyRepository
	) {}

	async execute({
		id,
		data
	}: {
		id: number;
		data: Partial<Family>;
	}): Promise<{ family: FamilyEntity; message: string }> {
		return await this.repository.update(id, data);
	}
}
