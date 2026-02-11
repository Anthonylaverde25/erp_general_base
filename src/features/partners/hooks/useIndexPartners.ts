import { useQuery } from "@tanstack/react-query";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { IndexPartnersUseCase } from "@/application/use_cases/partners/IndexPartnersUseCase";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";

export function useIndexPartners() {
    const useCase = container.get<IndexPartnersUseCase>(TYPES.IndexPartnersUseCase);

    return useQuery<PartnerEntity[], Error>({
        queryKey: ["partners"],
        queryFn: async () => await useCase.execute(),
    });
}
