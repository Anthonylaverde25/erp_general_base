import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateTaxRateUseCase } from "@/application/use_cases/tax_rates/CreateTaxRateUseCase";
import { CreateTaxRateDTO } from "@/domain/entities/tax_rates/DTOs/CreateTaxRateDTO";
import { TaxRateEntity } from "@/domain/entities/tax_rates/TaxRateEntity";

import { toast } from "sonner";

export function useCreateTaxRate() {
    const queryClient = useQueryClient();
    const useCase = container.get<CreateTaxRateUseCase>(TYPES.CreateTaxRateUseCase);

    return useMutation<{ tax_rate: TaxRateEntity; message: string }, Error, CreateTaxRateDTO>({
        mutationFn: async (data: CreateTaxRateDTO) => await useCase.execute(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tax_rates"] });
            toast.success(data.message);
        },
    });
}
