import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexTaxRatesUseCase } from '@/application/use_cases/tax_rates/IndexTaxRatesUseCase';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexTaxRates() {
	const useCase = container.get<IndexTaxRatesUseCase>(TYPES.IndexTaxRatesUseCase);
	const activeCompany = useActiveCompany();

	return useQuery<TaxRateEntity[], Error>({
		queryKey: ['tax_rates', activeCompany?.id],
		queryFn: async () => await useCase.execute()
	});
}
