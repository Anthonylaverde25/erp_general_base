import { Container } from 'inversify';
import { TYPES } from '../types';
import { ITaxRateRepository } from '@/domain/entities/tax_rates/repositories/tax-rates.interface.repository';
import { TaxRateRepositoryCrud } from '@/infrastructure/repositories/tax_rates/TaxRateRepositoryCrud';
import { IndexTaxRatesUseCase } from '@/application/use_cases/tax_rates/IndexTaxRatesUseCase';
import { CreateTaxRateUseCase } from '@/application/use_cases/tax_rates/CreateTaxRateUseCase';
import { UpdateTaxRateUseCase } from '@/application/use_cases/tax_rates/UpdateTaxRateUseCase';

export function registerTaxRatesModule(container: Container) {
	// Repository
	container.bind<ITaxRateRepository>(TYPES.ITaxRateRepository).to(TaxRateRepositoryCrud);

	// Use Cases
	container.bind<IndexTaxRatesUseCase>(TYPES.IndexTaxRatesUseCase).to(IndexTaxRatesUseCase);
	container.bind<CreateTaxRateUseCase>(TYPES.CreateTaxRateUseCase).to(CreateTaxRateUseCase);
	container.bind<UpdateTaxRateUseCase>(TYPES.UpdateTaxRateUseCase).to(UpdateTaxRateUseCase);
}
