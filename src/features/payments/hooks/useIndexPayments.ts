import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';
import { PaymentEntity, PaymentEntityMapper } from '@/domain/entities/payments/PaymentEntity';

interface UseIndexPaymentsProps {
    documentId: string | number;
    enabled?: boolean;
}

export function useIndexPayments({ documentId, enabled = true }: UseIndexPaymentsProps) {
    const { data: payments = [], isLoading, isError, refetch } = useQuery<PaymentEntity[]>({
        queryKey: ['document-payments', String(documentId)],
        queryFn: async () => {
            const { data: { data } } = await axiosInstance.get(`documents/${documentId}/payments`);
            return data.map((payment: any) => PaymentEntityMapper.fromJson(payment));
        },
        enabled: enabled && !!documentId,
    });

    return { payments, isLoading, isError, refetch };
}
