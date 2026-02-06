import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { IStoreActionRepository } from "@/domain/entities/stores/repositories/store.action.repository";

@injectable()
export class StoreRepositoryAction implements IStoreActionRepository {
    async toggleStatus(id: number, status: boolean): Promise<void> {
        await axiosInstance.put(`stores/${id}/toggle-status`, { is_active: status });
    }
}
