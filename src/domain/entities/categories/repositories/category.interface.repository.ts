import { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from "../DTOs/CategoryDTOs";
import { CategoryEntity } from "../CategoryEntity";

export interface ICategoryRepository {
    index(): Promise<CategoryEntity[]>;
    show(id: number): Promise<CategoryEntity>;
    create(data: CreateCategoryDTO): Promise<{ category: CategoryEntity; message: string }>;
    update(id: number, data: UpdateCategoryDTO): Promise<{ category: CategoryEntity; message: string }>;
}
