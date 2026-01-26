import { ChangeCompanyUseCase } from '@/application/use_cases/company/ChangeCompanyUseCase';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { useMutation } from '@tanstack/react-query';
import { Company } from '@/types/company.types';

export default function useChangeCompany() {
    const use_case = container.get<ChangeCompanyUseCase>(TYPES.ChangeCompanyUseCase);

    const mutation = useMutation({
        mutationFn: (companyId: Company['id']) => use_case.execute(companyId)
    });



    return {
        changeCompany: mutation.mutate,
        changeCompanyAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error
    };
}
