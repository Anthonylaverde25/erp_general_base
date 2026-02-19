import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { ICategoryActionRepository } from "@/domain/entities/categories/repositories/category.action.repository";

@injectable()
export class ToggleCategoryStatusUseCase {
    constructor(
        @inject(TYPES.CategoryActionRepository)
        private repository: ICategoryActionRepository
    ) { }

    async execute(id: number, status: boolean): Promise<void> {
        await this.repository.toggleStatus(id, status);
    }
}
