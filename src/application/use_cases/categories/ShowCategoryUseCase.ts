import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { ICategoryRepository } from '@/domain/entities/categories/repositories/category.interface.repository';
import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';

@injectable()
export class ShowCategoryUseCase {
	constructor(
		@inject(TYPES.CategoryRepository)
		private repository: ICategoryRepository
	) {}

	async execute(id: number): Promise<CategoryEntity> {
		return await this.repository.show(id);
	}
}
