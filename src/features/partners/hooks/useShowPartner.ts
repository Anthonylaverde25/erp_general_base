import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ShowPartnerUseCase } from "@/application/use_cases/partners/ShowPartnerUseCase";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";

export function useShowPartner(id: number) {
    const useCase = container.get<ShowPartnerUseCase>(TYPES.ShowPartnerUseCase);

    return useQuery<PartnerEntity, Error>({
        queryKey: ["partners", id],
        queryFn: async () => await useCase.execute(id),
        enabled: !!id,
    });
}
