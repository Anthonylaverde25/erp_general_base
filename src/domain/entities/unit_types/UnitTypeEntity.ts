import { CreateUnitTypeDTO, UnitTypeDTO, UnitTypeApplicability } from "./DTOs/UnitTypeDTOs";
import { UnitEntity } from "../units/UnitEntity";

export class UnitTypeEntity {
    constructor(
        public readonly id: number,
        public readonly company_id: number,
        public readonly name: string,
        public readonly description: string | null,
        public readonly applicability: UnitTypeApplicability,
        public readonly is_active: boolean,
        public readonly units: UnitEntity[] = []
    ) { }

    static fromPrimitives(data: UnitTypeDTO): UnitTypeEntity {
        return new UnitTypeEntity(
            data.id,
            data.company_id,
            data.name,
            data.description,
            data.applicability,
            data.is_active,
            data.units ? data.units.map(u => UnitEntity.fromPrimitives(u)) : []
        );
    }

    static create(data: CreateUnitTypeDTO): UnitTypeEntity {
        return new UnitTypeEntity(
            0, // Temporary ID
            0, // Temporary Company ID
            data.name,
            data.description || null,
            data.applicability,
            data.is_active ?? true,
            []
        );
    }

    toPlainObject(): UnitTypeDTO {
        return {
            id: this.id,
            company_id: this.company_id,
            name: this.name,
            description: this.description,
            applicability: this.applicability,
            is_active: this.is_active,
            units: this.units.map(u => u.toPlainObject())
        };
    }
}
