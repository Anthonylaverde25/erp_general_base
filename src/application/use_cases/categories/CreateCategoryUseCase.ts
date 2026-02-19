import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/domain/entities/categories/repositories/category.interface.repository";
import { CreateCategoryDTO } from "@/domain/entities/categories/DTOs/CategoryDTOs";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";

@injectable()
export class CreateCategoryUseCase {
    constructor(
        @inject(TYPES.CategoryRepository)
        private repository: ICategoryRepository
    ) { }

    async execute(data: CreateCategoryDTO): Promise<{ category: CategoryEntity; message: string }> {
        return await this.repository.create(data);
    }
}
