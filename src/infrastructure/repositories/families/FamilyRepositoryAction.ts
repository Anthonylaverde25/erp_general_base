import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { IFamilyActionRepository } from "@/domain/entities/families/repositories/family.action.repository";

@injectable()
export class FamilyRepositoryAction implements IFamilyActionRepository {
    async toggleStatus(id: number, status: boolean): Promise<void> {
        await axiosInstance.put(`families/${id}/toggle-status`, { is_active: status });
    }
}
