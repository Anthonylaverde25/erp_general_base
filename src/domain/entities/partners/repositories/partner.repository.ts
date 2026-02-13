import { CreatePartnerDTO, PartnerDTO, UpdatePartnerDTO } from "../DTOs/PartnerDTOs";
import { PartnerEntity } from "../PartnerEntity";

export interface IPartnerRepository {
    index(): Promise<PartnerEntity[]>;
    show(id: number): Promise<PartnerEntity>;
    create(data: CreatePartnerDTO): Promise<{ partner: PartnerEntity; message: string }>;
    update(id: number, data: UpdatePartnerDTO): Promise<{ partner: PartnerEntity; message: string }>;
    delete?(id: number): Promise<void>;
}
