import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';

interface UpdateRouteStatusPayload {
	id: number;
	status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

/**
 * Mutation hook to update route status.
 */
export function useUpdateRouteStatus() {
	const queryClient = useQueryClient();

	return useMutation<any, Error, UpdateRouteStatusPayload>({
		mutationFn: async ({ id, status }) => {
			const { data } = await axiosInstance.post(`routes/${id}/status`, { status });
			return data.data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['routes'] });
			queryClient.invalidateQueries({ queryKey: ['routes', variables.id] });
		}
	});
}
