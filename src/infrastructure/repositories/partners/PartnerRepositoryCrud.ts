import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { IPartnerRepository } from "@/domain/entities/partners/repositories/partner.repository";
import { CreatePartnerDTO, UpdatePartnerDTO } from "@/domain/entities/partners/DTOs/PartnerDTOs";
import { PartnerEntity } from "@/domain/entities/partners/PartnerEntity";
import { PartnerMapper } from "@/infrastructure/mappers/partners/PartnerMapper";

@injectable()
export class PartnerRepositoryCrud implements IPartnerRepository {
    async index(): Promise<PartnerEntity[]> {
        const {
            data: { partners },
        } = await axiosInstance.get("partners");
        return PartnerMapper.fromDTOList(partners);
    }

    async show(id: number): Promise<PartnerEntity> {
        const {
            data: { partner },
        } = await axiosInstance.get(`partners/${id}`);
        return PartnerMapper.fromDTO(partner);
    }

    async create(data: PartnerEntity): Promise<{ partner: PartnerEntity; message: string }> {
        const payload = data.toPlainObject();
        const {
            data: { partner, message },
        } = await axiosInstance.post("partners", payload);
        return {
            partner: PartnerMapper.fromDTO(partner),
            message,
        };
    }

    async update(id: number, data: PartnerEntity): Promise<{ partner: PartnerEntity; message: string }> {
        const payload = data.toPlainObject();
        const {
            data: { partner, message },
        } = await axiosInstance.put(`partners/${id}`, payload);
        return {
            partner: PartnerMapper.fromDTO(partner),
            message,
        };
    }
}
