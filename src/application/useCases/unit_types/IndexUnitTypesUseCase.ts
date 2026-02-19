import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { IUnitTypeRepository } from "@/domain/entities/unit_types/repositories/unit_type.interface.repository";
import { UnitTypeEntity } from "@/domain/entities/unit_types/UnitTypeEntity";

@injectable()
export class IndexUnitTypesUseCase {
    constructor(
        @inject(TYPES.UnitTypeRepository) private repository: IUnitTypeRepository
    ) { }

    async execute(): Promise<UnitTypeEntity[]> {
        return this.repository.index();
    }
}
