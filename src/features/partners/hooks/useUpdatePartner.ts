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

    const mutation = useMutation<{ partner: PartnerEntity; message: string }, Error, { id: number; data: UpdatePartnerDTO }>({

        mutationFn: async ({ id, data }) => await useCase.execute(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            queryClient.invalidateQueries({ queryKey: ["partners", variables.id] });
            toast.success(data.message);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Error al actualizar socio");
            console.error(error);
        },
    });

    const handleUpdatePartner = async (id: number, data: UpdatePartnerDTO) => {
        return await mutation.mutateAsync({ id, data });
    };

    return {
        handleUpdatePartner,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error
    };
}
