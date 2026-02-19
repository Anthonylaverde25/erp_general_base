import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { ICategoryActionRepository } from "@/domain/entities/categories/repositories/category.action.repository";

@injectable()
export class CategoryRepositoryAction implements ICategoryActionRepository {
    async toggleStatus(id: number, status: boolean): Promise<void> {
        await axiosInstance.put(`categories/${id}/toggle-status`, { is_active: status });
    }
}
