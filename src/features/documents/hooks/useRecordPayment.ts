import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { RecordPaymentUseCase } from '@/application/use_cases/documents/RecordPaymentUseCase';

/**
 * Mutation hook that calls POST /documents/{id}/payments.
 * On success it invalidates the specific document's query.
 */
export function useRecordPayment() {
    const useCase = container.get<RecordPaymentUseCase>(TYPES.RecordPaymentUseCase);
    const queryClient = useQueryClient();

    return useMutation<any, Error, { id: string; payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string } }>({
        mutationFn: ({ id, payload }) => useCase.execute(id, payload),
        onSuccess: (_response, variables) => {
            // Refresh the document to show updated status and any payment info (if displayed)
            queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
            // Refresh the documents list
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
}
