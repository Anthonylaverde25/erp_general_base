import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { UpdatePartnerUseCase } from "@/application/use_cases/partners/UpdatePartnerUseCase";
import { UpdatePartnerDTO } from "@/domain/entities/partners/DTOs/PartnerDTOs";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import { toast } from "sonner";

export function useUpdatePartner() {
    const queryClient = useQueryClient();
    const useCase = container.get<UpdatePartnerUseCase>(TYPES.UpdatePartnerUseCase);

    return useMutation<{ partner: PartnerEntity; message: string }, Error, { id: number; data: UpdatePartnerDTO }>({
        mutationFn: async ({ id, data }) => await useCase.execute(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            toast.success(data.message);
        },
    });
}
