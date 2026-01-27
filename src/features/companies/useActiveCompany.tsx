import useAuth from "@fuse/core/FuseAuthProvider/useAuth";
import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ShowCompanyUseCase } from "@/application/use_cases/company/ShowCompanyUseCase";


export default function useActiveCompany() {
    const { authState: { user: { active_company } = {} } = {} } = useAuth();
    const show_company_use_case = container.get<ShowCompanyUseCase>(TYPES.ShowCompanyUseCase);

    const { data: activeCompany } = useQuery({
        queryKey: ['activeCompany', { id: active_company?.id }],
        queryFn: () => {
            if (!active_company?.id) return null;
            return show_company_use_case.execute(active_company.id);
        },
        enabled: !!active_company?.id,
        initialData: active_company as any, // Use context data as initial placeholder
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return activeCompany || {};
}