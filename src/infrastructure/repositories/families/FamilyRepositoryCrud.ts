import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { IFamilyRepository } from "@/domain/entities/families/repositories/families.interface.repository";
import { CreateFamilyDTO } from "@/domain/entities/families/DTOs/FamilyDTOs";
import { FamilyEntity, Family } from "@/domain/entities/families/FamilyEntity";
import { FamilyMapper } from "@/infrastructure/mappers/families/FamilyMapper";

@injectable()
export class FamilyRepositoryCrud implements IFamilyRepository {
    async index(): Promise<FamilyEntity[]> {
        const {
            data: { families },
        } = await axiosInstance.get("families");
        return FamilyMapper.fromDTOList(families);
    }

    async show(id: number): Promise<FamilyEntity> {
        const {
            data: { family },
        } = await axiosInstance.get(`families/${id}`);
        return FamilyMapper.fromDTO(family);
    }

    async create(data: CreateFamilyDTO): Promise<{ family: FamilyEntity; message: string }> {
        const {
            data: { family, message },
        } = await axiosInstance.post("families", data);
        return {
            family: FamilyMapper.fromDTO(family),
            message,
        };
    }

    async update(id: number, data: Partial<Family>): Promise<{ family: FamilyEntity; message: string }> {
        const {
            data: { family, message },
        } = await axiosInstance.put(`families/${id}`, data);
        return {
            family: FamilyMapper.fromDTO(family),
            message,
        };
    }
}
