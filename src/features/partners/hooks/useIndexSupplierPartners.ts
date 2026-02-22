import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexSupplierPartnersUseCase } from '@/application/use_cases/partners/IndexSupplierPartnersUseCase';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';
import useActiveCompany from '@/features/companies/useActiveCompany';

export function useIndexSupplierPartners() {
	const useCase = container.get<IndexSupplierPartnersUseCase>(TYPES.IndexSupplierPartnersUseCase);
	const activeCompany = useActiveCompany();

	return useQuery<PartnerEntity[], Error>({
		queryKey: ['partners', 'suppliers', activeCompany?.id],
		queryFn: async () => await useCase.execute()
	});
}
