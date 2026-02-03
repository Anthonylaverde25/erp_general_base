import { IndexPaymentMethodsUseCase } from "@/application/use_cases/payment_methods/IndexPaymentMethodsUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useQuery } from "@tanstack/react-query";

export default function useIndexPaymentMethods() {
    const use_case = container.get<IndexPaymentMethodsUseCase>(TYPES.IndexPaymentMethodsUseCase);
    const activeCompany = useActiveCompany();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["paymentMethods", activeCompany?.id],
        queryFn: async () => {
            return await use_case.execute();
        },
        enabled: !!activeCompany?.id,
    });

    return {
        paymentMethods: data,
        isLoading,
        isError,
        error,
    };
}
