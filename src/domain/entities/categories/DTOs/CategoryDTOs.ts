export interface CategoryDTO {
	id: number;
	company_id: number;
	parent_id: number | null;
	parent_name: string | null;
	name: string;
	description: string | null;
	is_active: boolean;
	children: CategoryDTO[];
}

export interface CreateCategoryDTO {
	name: string;
	description?: string;
	parent_id?: number;
	is_active?: boolean;
}

export interface UpdateCategoryDTO {
	name?: string;
	description?: string;
	parent_id?: number;
	is_active?: boolean;
}
