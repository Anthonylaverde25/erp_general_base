import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';
import { CategoryFormType } from './categories.schema';

export const defaultCreateCategoryValues: CategoryFormType = {
	name: '',
	description: '',
	parent_id: null,
	is_active: true,
	is_subcategory: false
};

export const defaultUpdateCategoryValues = (category: CategoryEntity): CategoryFormType => ({
	name: category.name,
	description: category.description || '',
	parent_id: category.parent_id,
	is_active: category.is_active,
	is_subcategory: !!category.parent_id
});
