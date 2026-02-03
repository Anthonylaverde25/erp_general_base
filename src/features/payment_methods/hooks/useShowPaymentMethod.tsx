import { ShowPaymentMethodUseCase } from "@/application/use_cases/payment_methods/ShowPaymentMethodUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useQuery } from "@tanstack/react-query";

export default function useShowPaymentMethod(id: number | undefined) {
    const use_case = container.get<ShowPaymentMethodUseCase>(TYPES.ShowPaymentMethodUseCase);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["paymentMethod", id],
        queryFn: async () => {
            if (!id) throw new Error("No payment method ID");
            return await use_case.execute(id);
        },
        enabled: !!id,
    });

    return {
        paymentMethod: data,
        isLoading,
        isError,
    };
}
