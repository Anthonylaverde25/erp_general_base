import { CategoryDTO, CreateCategoryDTO } from './DTOs/CategoryDTOs';

export class CategoryEntity {
	constructor(
		public readonly id: number,
		public readonly company_id: number,
		public readonly parent_id: number | null,
		public readonly parent_name: string | null,
		public readonly name: string,
		public readonly description: string | null,
		public readonly is_active: boolean,
		public readonly children: CategoryEntity[]
	) {}

	static fromPrimitives(data: CategoryDTO): CategoryEntity {
		return new CategoryEntity(
			data.id,
			data.company_id,
			data.parent_id,
			data.parent_name,
			data.name,
			data.description,
			data.is_active,
			data.children ? data.children.map(CategoryEntity.fromPrimitives) : []
		);
	}

	static create(data: CreateCategoryDTO): CategoryEntity {
		return new CategoryEntity(
			0, // Temporary ID
			0, // Temporary Company ID
			data.parent_id || null,
			null,
			data.name,
			data.description || null,
			data.is_active ?? true,
			[]
		);
	}

	toPlainObject(): CategoryDTO {
		return {
			id: this.id,
			company_id: this.company_id,
			parent_id: this.parent_id,
			parent_name: this.parent_name,
			name: this.name,
			description: this.description,
			is_active: this.is_active,
			children: this.children.map((child) => child.toPlainObject())
		};
	}
}
