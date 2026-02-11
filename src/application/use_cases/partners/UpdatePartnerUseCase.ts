import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { IPartnerRepository } from "@/domain/entities/partners/repositories/partner.repository";
import { UpdatePartnerDTO } from "@/domain/entities/partners/DTOs/PartnerDTOs";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";

@injectable()
export class UpdatePartnerUseCase {
    constructor(
        @inject(TYPES.PartnerRepository)
        private repository: IPartnerRepository
    ) { }

    async execute(id: number, data: UpdatePartnerDTO): Promise<{ partner: PartnerEntity; message: string }> {
        const partner = PartnerEntity.update(id, data as any);
        return await this.repository.update(id, partner);
    }
}
