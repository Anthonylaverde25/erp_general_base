import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';
import { CreateRouteFormType } from '@/schemas/route/route.schema';

/**
 * Mutation hook to create a new route.
 */
export function useCreateRoute() {
	const queryClient = useQueryClient();

	return useMutation<any, Error, CreateRouteFormType>({
		mutationFn: async (payload) => {
			const { data } = await axiosInstance.post('routes', payload);
			return data.data;
		},
		onSuccess: () => {
			// Invalidate documents to refresh list status
			queryClient.invalidateQueries({ queryKey: ['documents'] });
			// Invalidate routes query if any
			queryClient.invalidateQueries({ queryKey: ['routes'] });
		}
	});
}
