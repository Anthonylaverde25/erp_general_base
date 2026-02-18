import { Container } from "inversify";
import { TYPES } from "../types";
import { ICategoryRepository } from "@/domain/entities/categories/repositories/category.interface.repository";
import { CategoryRepositoryCrud } from "@/infrastructure/repositories/categories/CategoryRepositoryCrud";
import { IndexCategoriesUseCase } from "@/application/use_cases/categories/IndexCategoriesUseCase";

export function registerCategoryModule(container: Container) {
    // Repository
    container
        .bind<ICategoryRepository>(TYPES.CategoryRepository)
        .to(CategoryRepositoryCrud)
        .inSingletonScope();

    // Use Cases
    container.bind<IndexCategoriesUseCase>(TYPES.IndexCategoriesUseCase).to(IndexCategoriesUseCase);
}
