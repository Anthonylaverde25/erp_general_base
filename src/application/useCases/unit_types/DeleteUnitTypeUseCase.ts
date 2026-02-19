import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { IUnitTypeRepository } from "@/domain/entities/unit_types/repositories/unit_type.interface.repository";

@injectable()
export class DeleteUnitTypeUseCase {
    constructor(
        @inject(TYPES.UnitTypeRepository) private repository: IUnitTypeRepository
    ) { }

    async execute(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}
