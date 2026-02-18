import { injectable } from "inversify";
import { ICategoryRepository } from "@/domain/entities/categories/repositories/category.interface.repository";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";
import { CategoryDTO } from "@/domain/entities/categories/DTOs/CategoryDTOs";
import axiosInstance from "@/lib/@axios";

@injectable()
export class CategoryRepositoryCrud implements ICategoryRepository {
    private readonly endpoint = "/categories";

    async index(): Promise<CategoryEntity[]> {
        const response = await axiosInstance.get<CategoryDTO[]>(this.endpoint);
        return response.data.map(CategoryEntity.fromPrimitives);
    }
}
