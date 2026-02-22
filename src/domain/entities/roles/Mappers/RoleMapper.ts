import { RoleListDTO } from '../DTOs/roleListDTO';
import { RoleEntity } from '../Role';

export class RoleMapper {
	static fromDetailDTO(dto: RoleListDTO): RoleEntity {
		return new RoleEntity(dto.id, dto.name, dto.code, dto.description, dto.active, dto.created_at, dto.updated_at);
	}

	static fromDetailDTOList(dtos: RoleListDTO[]): RoleEntity[] {
		return dtos.map((dto) => this.fromDetailDTO(dto));
	}
}
