import { RoleListDTO } from '../DTOs/roleListDTO';
import { RoleEntity } from '../Role';

export class RoleMapper {
	static fromDetailDTO(dto: RoleListDTO): RoleEntity {
		const permissions = dto.permissions 
			? dto.permissions.map((p: any) => typeof p === 'object' ? p.id : p) 
			: [];

		return new RoleEntity(
			dto.id, 
			dto.name, 
			dto.code, 
			dto.description, 
			dto.active, 
			dto.created_at, 
			dto.updated_at,
			permissions
		);
	}

	static fromDetailDTOList(dtos: RoleListDTO[]): RoleEntity[] {
		return dtos.map((dto) => this.fromDetailDTO(dto));
	}
}
