import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { ITaxTypeRepository } from '@/domain/entities/tax_types/repositories/tax-types.interface.repository';
import type { IUseCase } from '@/application/use_cases/IUseCase';

@injectable()
export class ToggleTaxTypeStatusUseCase
	implements IUseCase<{ id: number; status: boolean }, { id: number; is_active: boolean; message: string }>
{
	constructor(@inject(TYPES.ITaxTypeRepository) private repository: ITaxTypeRepository) {}

	async execute(payload: {
		id: number;
		status: boolean;
	}): Promise<{ id: number; is_active: boolean; message: string }> {
		return await this.repository.changeStatus(payload.id);
	}
}
