import { StoreEntity } from '../StoreEntity';
import { CreateStoreDTO } from '../DTOs/CreateStoreDTO';

export interface IStoreRepository {
	index(): Promise<StoreEntity[]>;
	create(data: CreateStoreDTO): Promise<{ store: StoreEntity; message: string }>;
	show(id: number): Promise<StoreEntity>;
	update(id: number, data: Partial<StoreEntity>): Promise<{ store: StoreEntity; message: string }>;
	delete(id: number): Promise<void>;
}
