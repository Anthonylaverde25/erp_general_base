import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';
import useUser from '@auth/useUser';

export interface ITenantModule {
	code: string;
	name: string;
}

export interface ITenantModulesContext {
	available: ITenantModule[];
	licensed: string[];
	isLoading: boolean;
	hasModule: (code: string) => boolean;
	hasAnyModule: (codes: string[]) => boolean;
}

const TenantModulesContext = createContext<ITenantModulesContext | undefined>(undefined);

export function TenantModulesProvider({ children }: { children: ReactNode }) {
	const { data: user } = useUser();
	const activeCompanyId = user?.active_company_id;

	const { data, isLoading } = useQuery<{ available: ITenantModule[]; licensed: string[] }>({
		queryKey: ['tenantModules', { activeCompanyId }],
		queryFn: async () => {
			const { data } = await axiosInstance.get<{ available: ITenantModule[]; licensed: string[] }>('auth/modules');
			return data;
		},
		enabled: !!user && !!activeCompanyId,
		staleTime: 1000 * 60 * 5 // Cache of 5 minutes per company
	});

	const contextValue = useMemo<ITenantModulesContext>(() => {
		const available = data?.available ?? [];
		const licensed = data?.licensed ?? [];

		return {
			available,
			licensed,
			isLoading,
			hasModule: (code: string) => licensed.includes(code),
			hasAnyModule: (codes: string[]) => codes.some((code) => licensed.includes(code))
		};
	}, [data, isLoading]);

	return (
		<TenantModulesContext value={contextValue}>
			{children}
		</TenantModulesContext>
	);
}

export function useTenantModules(): ITenantModulesContext {
	const context = useContext(TenantModulesContext);
	if (context === undefined) {
		throw new Error('useTenantModules must be used within a TenantModulesProvider');
	}
	return context;
}
