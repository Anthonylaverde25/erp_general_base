import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ShowAddressUseCase } from '@/application/use_cases/addresses/ShowAddressUseCase';

export const useShowAddress = (id: number | null) => {
	const showAddressUseCase = container.get<ShowAddressUseCase>(TYPES.ShowAddressUseCase);

	return useQuery({
		queryKey: ['addresses', id],
		queryFn: () => showAddressUseCase.execute(id!),
		enabled: !!id
	});
};
