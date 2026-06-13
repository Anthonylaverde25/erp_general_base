import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';

interface UpdateDeliveryStatusPayload {
	routeId: number;
	documentId: number;
	delivery_status: 'pending' | 'delivered' | 'failed' | 'rescheduled';
	delivery_notes?: string | null;
}

/**
 * Mutation hook to update the delivery status of an individual document in a route.
 */
export function useUpdateDeliveryStatus() {
	const queryClient = useQueryClient();

	return useMutation<any, Error, UpdateDeliveryStatusPayload>({
		mutationFn: async ({ routeId, documentId, delivery_status, delivery_notes }) => {
			const { data } = await axiosInstance.post(
				`routes/${routeId}/documents/${documentId}/delivery-status`,
				{ delivery_status, delivery_notes }
			);
			return data.data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['routes'] });
			queryClient.invalidateQueries({ queryKey: ['routes', variables.routeId] });
			queryClient.invalidateQueries({ queryKey: ['documents'] });
		}
	});
}
