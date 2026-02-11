import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreatePartnerUseCase } from "@/application/use_cases/partners/CreatePartnerUseCase";
import { CreatePartnerDTO } from "@/domain/entities/partners/DTOs/PartnerDTOs";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import { toast } from "sonner";

export function useCreatePartner() {
    const queryClient = useQueryClient();
    const useCase = container.get<CreatePartnerUseCase>(TYPES.CreatePartnerUseCase);

    const mutation = useMutation<{ partner: PartnerEntity; message: string }, Error, CreatePartnerDTO>({
        mutationFn: async (data: CreatePartnerDTO) => await useCase.execute(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            toast.success(data.message);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Error al crear socio");
            console.error(error);
        },
    });

    const handleCreatePartner = async (data: CreatePartnerDTO) => {
        return await mutation.mutateAsync(data);
    };

    return {
        handleCreatePartner,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error
    };
}
