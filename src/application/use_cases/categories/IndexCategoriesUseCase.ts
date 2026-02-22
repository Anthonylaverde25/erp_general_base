import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';
import type { ICategoryRepository } from '@/domain/entities/categories/repositories/category.interface.repository';

@injectable()
export class IndexCategoriesUseCase {
	constructor(
		@inject(TYPES.CategoryRepository)
		private repository: ICategoryRepository
	) {}

	async execute(): Promise<CategoryEntity[]> {
		return await this.repository.index();
	}
}
