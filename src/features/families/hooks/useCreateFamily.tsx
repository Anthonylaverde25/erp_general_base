import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateFamilyUseCase } from "@/application/use_cases/families/CreateFamilyUseCase";
import { CreateFamilyDTO } from "@/domain/entities/families/DTOs/FamilyDTOs";
import { FamilyEntity } from "@/domain/entities/families/FamilyEntity";
import { toast } from "sonner";

export function useCreateFamily() {
    const queryClient = useQueryClient();
    const useCase = container.get<CreateFamilyUseCase>(TYPES.CreateFamilyUseCase);

    return useMutation<{ family: FamilyEntity; message: string }, Error, CreateFamilyDTO>({
        mutationFn: async (data: CreateFamilyDTO) => await useCase.execute(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["families"] });
            toast.success(data.message);
        },
    });
}
