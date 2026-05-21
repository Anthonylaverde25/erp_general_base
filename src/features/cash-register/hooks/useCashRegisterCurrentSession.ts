import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CurrentSessionUseCase } from '@/application/cash-register/CurrentSessionUseCase';

export default function useCashRegisterCurrentSession() {
	const useCase = container.get<CurrentSessionUseCase>(TYPES.CurrentSessionUseCase);

	return useQuery({
		queryKey: ['cashRegisterCurrentSession'],
		queryFn: async () => await useCase.execute(),
		refetchInterval: 30000
	});
}
