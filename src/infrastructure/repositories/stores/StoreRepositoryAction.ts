import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { IStoreActionRepository } from "@/domain/entities/stores/repositories/store.action.repository";
import { AddressEntity } from "@/domain/entities/addresses/Address";
import { StoreEntity } from "@/domain/entities/stores/StoreEntity";

@injectable()
export class StoreRepositoryAction implements IStoreActionRepository {
    async toggleStatus(id: number, status: boolean): Promise<void> {
        await axiosInstance.put(`stores/${id}/toggle-status`, { is_active: status });
    }


    async removeAddress(storeId: StoreEntity["id"], addressId: AddressEntity["id"]): Promise<void> {
        try {
            const { data } = await axiosInstance.delete(`stores/${storeId}/addresses/${addressId}`)
            console.log('direccion elimnada para la tienda', data)
            return data;
        } catch (error) {
            throw error;
        }
    }
}
