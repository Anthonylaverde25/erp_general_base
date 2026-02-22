import { ShowContactUseCase } from '@/application/use_cases/contacts/ShowContactUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ContactEntity } from '@/domain/entities/contacts/Contact';
import { useQuery } from '@tanstack/react-query';

export const useShowContact = (id: number | null | undefined) => {
	const use_case = container.get<ShowContactUseCase>(TYPES.ShowContactUseCase);

	return useQuery<ContactEntity>({
		queryKey: ['contacts', id],
		queryFn: () => use_case.execute(id!),
		enabled: !!id,
		staleTime: 1000 * 60 * 5 // 5 minutes
	});
};
