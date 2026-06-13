import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';

/**
 * Hook to fetch details of a single route.
 */
export function useShowRoute(id: number | null) {
	return useQuery<any, Error>({
		queryKey: ['routes', id],
		queryFn: async () => {
			if (id === null) return null;
			const { data } = await axiosInstance.get(`routes/${id}`);
			return data.data;
		},
		enabled: id !== null
	});
}
