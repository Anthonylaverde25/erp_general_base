import { UnitTypeEntity } from "@/domain/entities/unit_types/UnitTypeEntity";
import { CreateUnitTypeDTO, UnitTypeDTO, UpdateUnitTypeDTO } from "@/domain/entities/unit_types/DTOs/UnitTypeDTOs";

export class UnitTypeMapper {
    static fromDTO(dto: UnitTypeDTO): UnitTypeEntity {
        return UnitTypeEntity.fromPrimitives({
            id: dto.id,
            company_id: dto.company_id,
            name: dto.name,
            description: dto.description,
            is_active: Boolean(dto.is_active),
        });
    }

    static fromDTOList(dtos: UnitTypeDTO[]): UnitTypeEntity[] {
        return dtos.map((dto) => UnitTypeMapper.fromDTO(dto));
    }

    static toDTO(entity: UnitTypeEntity): UnitTypeDTO {
        return entity.toPlainObject();
    }

    static toCreateDTO(data: CreateUnitTypeDTO): any {
        return {
            name: data.name,
            description: data.description,
            is_active: data.is_active,
        };
    }

    static toUpdateDTO(data: UpdateUnitTypeDTO): any {
        return {
            name: data.name,
            description: data.description,
            is_active: data.is_active,
        };
    }
}
