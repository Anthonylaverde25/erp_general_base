import { CreateItemDTO, UpdateItemDTO } from "../DTOs/ItemDTOs";
import { ItemEntity } from "../ItemEntity";

export interface IItemRepository {
    index(): Promise<ItemEntity[]>;
    show(id: number): Promise<ItemEntity>;
    create(data: CreateItemDTO): Promise<{ item: ItemEntity; message: string }>;
    update(id: number, data: UpdateItemDTO): Promise<{ item: ItemEntity; message: string }>;
    delete(id: number): Promise<void>;
}
