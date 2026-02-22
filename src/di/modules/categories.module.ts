import { Container } from 'inversify';
import { TYPES } from '../types';
import { ICategoryRepository } from '@/domain/entities/categories/repositories/category.interface.repository';
import { CategoryRepositoryCrud } from '@/infrastructure/repositories/categories/CategoryRepositoryCrud';
import { IndexCategoriesUseCase } from '@/application/use_cases/categories/IndexCategoriesUseCase';
import { ICategoryActionRepository } from '@/domain/entities/categories/repositories/category.action.repository';
import { CategoryRepositoryAction } from '@/infrastructure/repositories/categories/CategoryRepositoryAction';
import { CreateCategoryUseCase } from '@/application/use_cases/categories/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '@/application/use_cases/categories/UpdateCategoryUseCase';
import { ShowCategoryUseCase } from '@/application/use_cases/categories/ShowCategoryUseCase';
import { ToggleCategoryStatusUseCase } from '@/application/use_cases/categories/ToggleCategoryStatusUseCase';

export function registerCategoryModule(container: Container) {
	// Repositories
	container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepositoryCrud).inSingletonScope();

	container
		.bind<ICategoryActionRepository>(TYPES.CategoryActionRepository)
		.to(CategoryRepositoryAction)
		.inSingletonScope();

	// Use Cases
	container.bind<IndexCategoriesUseCase>(TYPES.IndexCategoriesUseCase).to(IndexCategoriesUseCase);
	container.bind<CreateCategoryUseCase>(TYPES.CreateCategoryUseCase).to(CreateCategoryUseCase);
	container.bind<UpdateCategoryUseCase>(TYPES.UpdateCategoryUseCase).to(UpdateCategoryUseCase);
	container.bind<ShowCategoryUseCase>(TYPES.ShowCategoryUseCase).to(ShowCategoryUseCase);
	container.bind<ToggleCategoryStatusUseCase>(TYPES.ToggleCategoryStatusUseCase).to(ToggleCategoryStatusUseCase);
}
