import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { ITaxTypeRepository } from '@/domain/entities/tax_types/repositories/tax-types.interface.repository';
import { TaxTypeEntity } from '@/domain/entities/tax_types/TaxTypeEntity';

@injectable()
export class IndexTaxTypesUseCase implements IUseCase<void, TaxTypeEntity[]> {
	constructor(
		@inject(TYPES.ITaxTypeRepository)
		private readonly repository: ITaxTypeRepository
	) {}

	async execute(): Promise<TaxTypeEntity[]> {
		return await this.repository.index();
	}
}
