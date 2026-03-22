import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { RecordPaymentUseCase } from '@/application/use_cases/documents/RecordPaymentUseCase';
import { toast } from 'sonner';

/**
 * Mutation hook that calls POST /documents/{id}/payments.
 * On success it invalidates the specific document's query.
 */
export function useRecordPayment() {
    const useCase = container.get<RecordPaymentUseCase>(TYPES.RecordPaymentUseCase);
    const queryClient = useQueryClient();

    return useMutation<any, Error, { id: string; payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string } }>({
        mutationFn: ({ id, payload }) => useCase.execute(id, payload),
        onSuccess: (response, variables) => {
            // Display success message from API
            toast.success(response?.message || 'Pago registrado correctamente');

            // Broad invalidation: any document details currently in cache could be affected by cascade
            queryClient.invalidateQueries({ queryKey: ['document'] });
            
            // Refresh specific payments list for the current document
            queryClient.invalidateQueries({ queryKey: ['document-payments', String(variables.id)] });
            
            // Refresh the general documents list
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Error al registrar el pago');
        }
    });
}
