import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFamilyRepository } from '@/domain/entities/families/repositories/families.interface.repository';
import { CreateFamilyDTO } from '@/domain/entities/families/DTOs/FamilyDTOs';
import { FamilyEntity } from '@/domain/entities/families/FamilyEntity';

@injectable()
export class CreateFamilyUseCase {
	constructor(
		@inject(TYPES.FamilyRepository)
		private repository: IFamilyRepository
	) {}

	async execute(data: CreateFamilyDTO): Promise<{ family: FamilyEntity; message: string }> {
		return await this.repository.create(data);
	}
}
