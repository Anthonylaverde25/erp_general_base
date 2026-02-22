import { UnitEntity } from '@/domain/entities/units/UnitEntity';
import { CreateUnitDTO, UnitDTO, UpdateUnitDTO } from '@/domain/entities/units/DTOs/UnitDTOs';

export class UnitMapper {
	static fromDTO(dto: UnitDTO): UnitEntity {
		return UnitEntity.fromPrimitives({
			id: dto.id,
			company_id: dto.company_id,
			unit_type_id: dto.unit_type_id,
			code: dto.code,
			name: dto.name,
			unit_type: dto.unit_type
				? {
						id: dto.unit_type.id,
						name: dto.unit_type.name,
						applicability: dto.unit_type.applicability
					}
				: undefined
		});
	}

	static fromDTOList(dtos: UnitDTO[]): UnitEntity[] {
		return dtos.map((dto) => UnitMapper.fromDTO(dto));
	}

	static toDTO(entity: UnitEntity): UnitDTO {
		return entity.toPlainObject();
	}

	static toCreateDTO(data: CreateUnitDTO): any {
		return {
			unit_type_id: data.unit_type_id,
			code: data.code,
			name: data.name
		};
	}

	static toUpdateDTO(data: UpdateUnitDTO): any {
		return {
			unit_type_id: data.unit_type_id,
			code: data.code,
			name: data.name
		};
	}
}
