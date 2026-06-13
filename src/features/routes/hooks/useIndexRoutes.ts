import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';

/**
 * Hook to fetch all routes.
 */
export function useIndexRoutes() {
	return useQuery<any[], Error>({
		queryKey: ['routes'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('routes');
			return data.data;
		}
	});
}
