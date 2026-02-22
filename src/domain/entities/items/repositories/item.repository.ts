import { ItemEntity } from '../ItemEntity';

export interface IItemRepository {
	index(): Promise<ItemEntity[]>;
	show(id: number): Promise<ItemEntity>;
	create(data: ItemEntity): Promise<{ item: ItemEntity; message: string }>;
	update(id: number, data: ItemEntity): Promise<{ item: ItemEntity; message: string }>;
	delete(id: number): Promise<void>;
}
