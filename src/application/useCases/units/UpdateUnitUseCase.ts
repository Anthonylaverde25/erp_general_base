import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IUnitRepository } from "@/domain/entities/units/repositories/unit.interface.repository";
import { UpdateUnitDTO } from "@/domain/entities/units/DTOs/UnitDTOs";
import { UnitEntity } from "@/domain/entities/units/UnitEntity";

@injectable()
export class UpdateUnitUseCase {
    constructor(
        @inject(TYPES.UnitRepository) private repository: IUnitRepository
    ) { }

    async execute(id: number, data: UpdateUnitDTO): Promise<UnitEntity> {
        return this.repository.update(id, data);
    }
}
