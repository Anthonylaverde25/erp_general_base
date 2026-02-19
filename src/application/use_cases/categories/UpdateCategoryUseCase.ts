import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/domain/entities/categories/repositories/category.interface.repository";
import { UpdateCategoryDTO } from "@/domain/entities/categories/DTOs/CategoryDTOs";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";

@injectable()
export class UpdateCategoryUseCase {
    constructor(
        @inject(TYPES.CategoryRepository)
        private repository: ICategoryRepository
    ) { }

    async execute(id: number, data: UpdateCategoryDTO): Promise<{ category: CategoryEntity; message: string }> {
        return await this.repository.update(id, data);
    }
}
