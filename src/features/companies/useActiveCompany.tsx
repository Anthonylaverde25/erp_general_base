import useAuth from "@fuse/core/FuseAuthProvider/useAuth";
import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ShowCompanyUseCase } from "@/application/use_cases/companies/ShowCompanyUseCase";
import { CompanyEntity } from "@/domain/entities/companies/Company";


export default function useActiveCompany(): CompanyEntity | undefined {
    const { authState: { user: { active_company_id } = {} } = {} } = useAuth();
    const show_company_use_case = container.get<ShowCompanyUseCase>(TYPES.ShowCompanyUseCase);

    const { data: activeCompany } = useQuery<CompanyEntity>({
        queryKey: ['activeCompany', { id: active_company_id }],
        queryFn: () => {
            if (!active_company_id) return null;
            return show_company_use_case.execute(active_company_id);
        },
        enabled: !!active_company_id,
        staleTime: 1000 * 60 * 5,
    });

    return activeCompany as CompanyEntity | undefined;
}