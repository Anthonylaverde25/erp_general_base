import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexCashRegistersUseCase } from '@/application/cash-register/IndexCashRegistersUseCase';

export default function useCashRegisters() {
	const useCase = container.get<IndexCashRegistersUseCase>(TYPES.IndexCashRegistersUseCase);

	return useQuery({
		queryKey: ['cashRegisters'],
		queryFn: async () => await useCase.execute()
	});
}
