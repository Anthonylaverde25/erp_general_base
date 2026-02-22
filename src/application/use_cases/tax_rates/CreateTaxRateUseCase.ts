import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { ITaxRateRepository } from '@/domain/entities/tax_rates/repositories/tax-rates.interface.repository';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';
import { CreateTaxRateDTO } from '@/domain/entities/tax_rates/DTOs/CreateTaxRateDTO';

@injectable()
export class CreateTaxRateUseCase implements IUseCase<CreateTaxRateDTO, { tax_rate: TaxRateEntity; message: string }> {
	constructor(
		@inject(TYPES.ITaxRateRepository)
		private readonly repository: ITaxRateRepository
	) {}

	async execute(data: CreateTaxRateDTO): Promise<{ tax_rate: TaxRateEntity; message: string }> {
		return await this.repository.create(data);
	}
}
