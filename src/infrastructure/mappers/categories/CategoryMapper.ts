import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';
import { CategoryDTO } from '@/domain/entities/categories/DTOs/CategoryDTOs';

export class CategoryMapper {
	static fromDTO(dto: CategoryDTO): CategoryEntity {
		return new CategoryEntity(
			dto.id,
			dto.company_id,
			dto.parent_id,
			dto.parent_name,
			dto.name,
			dto.description,
			dto.is_active,
			dto.children ? CategoryMapper.fromDTOList(dto.children) : []
		);
	}

	static fromDTOList(dtos: CategoryDTO[]): CategoryEntity[] {
		return dtos.map((dto) => CategoryMapper.fromDTO(dto));
	}
}
