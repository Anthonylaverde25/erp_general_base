import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { UpdateTaxRateUseCase } from "@/application/use_cases/tax_rates/UpdateTaxRateUseCase";
import { TaxRateEntity, TaxRate } from "@/domain/entities/tax_rates/TaxRateEntity";

import { toast } from "sonner";

export function useUpdateTaxRate() {
    const queryClient = useQueryClient();
    const useCase = container.get<UpdateTaxRateUseCase>(TYPES.UpdateTaxRateUseCase);

    return useMutation<{ tax_rate: TaxRateEntity; message: string }, Error, { id: number; data: Partial<TaxRate> }>({
        mutationFn: async ({ id, data }) => await useCase.execute({ id, data }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tax_rates"] });
            toast.success(data.message);
        },
    });
}
