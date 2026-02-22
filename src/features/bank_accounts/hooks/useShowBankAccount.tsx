import { ShowBankAccountUseCase } from '@/application/use_cases/bank_accounts/ShowBankAccountUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IBankAccount } from '@/types/bank_account.types';
import { useQuery } from '@tanstack/react-query';

export default function useShowBankAccount(id: IBankAccount['id']) {
	const use_case = container.get<ShowBankAccountUseCase>(TYPES.ShowBankAccountUseCase);

	const query = useQuery({
		queryKey: ['bank-account', id],
		queryFn: () => use_case.execute(id),
		refetchOnWindowFocus: true
	});

	return {
		bankAccount: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error
	};
}
