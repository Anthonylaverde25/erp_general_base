import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { ITaxRateRepository } from '@/domain/entities/tax_rates/repositories/tax-rates.interface.repository';
import { TaxRateEntity, TaxRate } from '@/domain/entities/tax_rates/TaxRateEntity';

@injectable()
export class UpdateTaxRateUseCase implements IUseCase<{ id: number; data: Partial<TaxRate> }, { tax_rate: TaxRateEntity; message: string }> {
    constructor(
        @inject(TYPES.ITaxRateRepository)
        private readonly repository: ITaxRateRepository
    ) { }

    async execute({ id, data }: { id: number; data: Partial<TaxRate> }): Promise<{ tax_rate: TaxRateEntity; message: string }> {
        return await this.repository.update(id, data);
    }
}
