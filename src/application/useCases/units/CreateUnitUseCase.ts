import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IUnitRepository } from '@/domain/entities/units/repositories/unit.interface.repository';
import { CreateUnitDTO } from '@/domain/entities/units/DTOs/UnitDTOs';
import { UnitEntity } from '@/domain/entities/units/UnitEntity';

@injectable()
export class CreateUnitUseCase {
	constructor(@inject(TYPES.UnitRepository) private repository: IUnitRepository) {}

	async execute(data: CreateUnitDTO): Promise<UnitEntity> {
		return this.repository.create(data);
	}
}
