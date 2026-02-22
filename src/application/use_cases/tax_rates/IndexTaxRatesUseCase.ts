import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { ITaxRateRepository } from '@/domain/entities/tax_rates/repositories/tax-rates.interface.repository';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';

@injectable()
export class IndexTaxRatesUseCase implements IUseCase<void, TaxRateEntity[]> {
	constructor(
		@inject(TYPES.ITaxRateRepository)
		private readonly repository: ITaxRateRepository
	) {}

	async execute(): Promise<TaxRateEntity[]> {
		return await this.repository.index();
	}
}
