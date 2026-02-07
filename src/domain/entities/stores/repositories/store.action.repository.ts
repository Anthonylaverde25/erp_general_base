import { AddressEntity } from "../../addresses/Address";
import { StoreEntity } from "../StoreEntity";

export interface IStoreActionRepository {
    toggleStatus(id: number, status: boolean): Promise<void>;
    removeAddress(storeId: StoreEntity['id'], addressId: AddressEntity['id']): Promise<void>;
}
