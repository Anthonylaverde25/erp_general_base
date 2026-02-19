import { injectable } from "inversify";
import { ICategoryRepository } from "@/domain/entities/categories/repositories/category.interface.repository";
import { CategoryEntity } from "@/domain/entities/categories/CategoryEntity";
import { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from "@/domain/entities/categories/DTOs/CategoryDTOs";
import axiosInstance from "@/lib/@axios";
import { CategoryMapper } from "@/infrastructure/mappers/categories/CategoryMapper";

@injectable()
export class CategoryRepositoryCrud implements ICategoryRepository {
    private readonly endpoint = "/categories";

    async index(): Promise<CategoryEntity[]> {
        const { data: { categories } } = await axiosInstance.get<{ categories: CategoryDTO[] }>(this.endpoint);
        return CategoryMapper.fromDTOList(categories);
    }

    async show(id: number): Promise<CategoryEntity> {
        const { data: { category } } = await axiosInstance.get<{ category: CategoryDTO }>(`${this.endpoint}/${id}`);
        return CategoryMapper.fromDTO(category);
    }

    async create(data: CreateCategoryDTO): Promise<{ category: CategoryEntity; message: string }> {
        const { data: { category, message } } = await axiosInstance.post<{ category: CategoryDTO; message: string }>(this.endpoint, data);
        return {
            category: CategoryMapper.fromDTO(category),
            message
        };
    }

    async update(id: number, data: UpdateCategoryDTO): Promise<{ category: CategoryEntity; message: string }> {
        const { data: { category, message } } = await axiosInstance.put<{ category: CategoryDTO; message: string }>(`${this.endpoint}/${id}`, data);
        return {
            category: CategoryMapper.fromDTO(category),
            message
        };
    }
}
