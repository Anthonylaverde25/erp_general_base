import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { IUnitTypeRepository } from "@/domain/entities/unit_types/repositories/unit_type.interface.repository";
import { CreateUnitTypeDTO } from "@/domain/entities/unit_types/DTOs/UnitTypeDTOs";
import { UnitTypeEntity } from "@/domain/entities/unit_types/UnitTypeEntity";

@injectable()
export class CreateUnitTypeUseCase {
    constructor(
        @inject(TYPES.UnitTypeRepository) private repository: IUnitTypeRepository
    ) { }

    async execute(data: CreateUnitTypeDTO): Promise<UnitTypeEntity> {
        return this.repository.create(data);
    }
}
