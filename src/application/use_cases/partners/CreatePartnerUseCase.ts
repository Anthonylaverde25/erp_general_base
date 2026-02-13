import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { IPartnerRepository } from "@/domain/entities/partners/repositories/partner.repository";
import { CreatePartnerDTO } from "@/domain/entities/partners/DTOs/PartnerDTOs";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";

@injectable()
export class CreatePartnerUseCase {
    constructor(
        @inject(TYPES.PartnerRepository)
        private repository: IPartnerRepository
    ) { }

    async execute(data: CreatePartnerDTO): Promise<{ partner: PartnerEntity; message: string }> {
        return await this.repository.create(data);
    }
}

