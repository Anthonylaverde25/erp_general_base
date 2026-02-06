import { CreateFamilyDTO } from "../DTOs/FamilyDTOs";
import { FamilyEntity, Family } from "../FamilyEntity";

export interface IFamilyRepository {
    index(): Promise<FamilyEntity[]>;
    show(id: number): Promise<FamilyEntity>;
    create(data: CreateFamilyDTO): Promise<{ family: FamilyEntity; message: string }>;
    update(id: number, data: Partial<Family>): Promise<{ family: FamilyEntity; message: string }>;
}
