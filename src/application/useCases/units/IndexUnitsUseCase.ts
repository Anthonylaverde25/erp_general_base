import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IUnitRepository } from '@/domain/entities/units/repositories/unit.interface.repository';
import { UnitEntity } from '@/domain/entities/units/UnitEntity';

@injectable()
export class IndexUnitsUseCase {
	constructor(@inject(TYPES.UnitRepository) private repository: IUnitRepository) {}

	async execute(): Promise<UnitEntity[]> {
		return this.repository.index();
	}
}
