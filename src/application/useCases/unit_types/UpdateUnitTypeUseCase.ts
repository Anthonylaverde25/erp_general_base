import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { IUnitTypeRepository } from "@/domain/entities/unit_types/repositories/unit_type.interface.repository";
import { UpdateUnitTypeDTO } from "@/domain/entities/unit_types/DTOs/UnitTypeDTOs";
import { UnitTypeEntity } from "@/domain/entities/unit_types/UnitTypeEntity";

@injectable()
export class UpdateUnitTypeUseCase {
    constructor(
        @inject(TYPES.UnitTypeRepository) private repository: IUnitTypeRepository
    ) { }

    async execute(id: number, data: UpdateUnitTypeDTO): Promise<UnitTypeEntity> {
        return this.repository.update(id, data);
    }
}
