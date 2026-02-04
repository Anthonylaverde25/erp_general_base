import { StoreEntity } from "../StoreEntity";
import { CreateStoreDTO } from "../DTOs/CreateStoreDTO";

export interface IStoreRepository {
    index(): Promise<StoreEntity[]>;
    create(data: CreateStoreDTO): Promise<{ store: StoreEntity; message: string }>;
}
