import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';

export interface PartnerFinancialSummary {
	sales_total: number;
	purchases_total: number;
	collected_total: number;
	paid_total: number;
	pending_collection: number;
	pending_payment: number;
	monthly_payments: {
		month: string;
		collected: number;
		paid: number;
	}[];
}

export function useShowPartnerFinancialSummary(id: number) {
	const query = useQuery<PartnerFinancialSummary, Error>({
		queryKey: ['partners', id, 'financial-summary'],
		queryFn: async () => {
			const { data } = await axiosInstance.get(`/partners/${id}/financial-summary`);
			return data;
		},
		enabled: !!id
	});

	return {
		summary: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error
	};
}
