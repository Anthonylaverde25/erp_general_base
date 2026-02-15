import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { ICurrencyRepository } from '@/domain/entities/currencies/repositories/currency.interface.repository';
import { CurrencyEntity } from '@/domain/entities/currencies/CurrencyEntity';

@injectable()
export class IndexCurrenciesUseCase implements IUseCase<void, CurrencyEntity[]> {
    constructor(
        @inject(TYPES.ICurrencyRepository)
        private readonly repository: ICurrencyRepository
    ) { }

    async execute(): Promise<CurrencyEntity[]> {
        return await this.repository.index();
    }
}
