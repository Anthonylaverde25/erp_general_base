import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IUnitRepository } from '@/domain/entities/units/repositories/unit.interface.repository';

@injectable()
export class DeleteUnitUseCase {
	constructor(@inject(TYPES.UnitRepository) private repository: IUnitRepository) {}

	async execute(id: number): Promise<void> {
		return this.repository.delete(id);
	}
}
