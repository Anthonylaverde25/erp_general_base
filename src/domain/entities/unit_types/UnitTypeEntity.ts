import { CreateUnitTypeDTO, UnitTypeDTO } from "./DTOs/UnitTypeDTOs";

export class UnitTypeEntity {
    constructor(
        public readonly id: number,
        public readonly company_id: number,
        public readonly name: string,
        public readonly description: string | null,
        public readonly is_active: boolean
    ) { }

    static fromPrimitives(data: UnitTypeDTO): UnitTypeEntity {
        return new UnitTypeEntity(
            data.id,
            data.company_id,
            data.name,
            data.description,
            data.is_active
        );
    }

    static create(data: CreateUnitTypeDTO): UnitTypeEntity {
        return new UnitTypeEntity(
            0, // Temporary ID
            0, // Temporary Company ID
            data.name,
            data.description || null,
            data.is_active ?? true
        );
    }

    toPlainObject(): UnitTypeDTO {
        return {
            id: this.id,
            company_id: this.company_id,
            name: this.name,
            description: this.description,
            is_active: this.is_active
        };
    }
}
