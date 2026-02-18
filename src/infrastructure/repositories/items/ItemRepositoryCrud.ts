import axiosInstance from "@/lib/@axios";
import { IItemRepository } from "@/domain/entities/items/repositories/item.repository";
import { CreateItemDTO, UpdateItemDTO, ItemDTO } from "@/domain/entities/items/DTOs/ItemDTOs";
import { ItemEntity } from "@/domain/entities/items/ItemEntity";
import { ItemMapper } from "@/infrastructure/mappers/items/ItemMapper";
import { injectable } from "inversify";

@injectable()
export class ItemRepositoryCrud implements IItemRepository {
    private readonly baseUrl = "/items";

    async index(): Promise<ItemEntity[]> {
        const { data } = await axiosInstance.get<{ items: ItemDTO[] }>(this.baseUrl);
        return data.items.map(ItemMapper.toDomain);
    }

    async show(id: number): Promise<ItemEntity> {
        const { data } = await axiosInstance.get<{ item: ItemDTO }>(`${this.baseUrl}/${id}`);
        return ItemMapper.toDomain(data.item);
    }

    async create(itemData: CreateItemDTO): Promise<{ item: ItemEntity; message: string }> {
        const { data } = await axiosInstance.post<{ item: ItemDTO; message: string }>(this.baseUrl, itemData);
        return {
            item: ItemMapper.toDomain(data.item),
            message: data.message
        };
    }

    async update(id: number, itemData: UpdateItemDTO): Promise<{ item: ItemEntity; message: string }> {
        const { data } = await axiosInstance.put<{ item: ItemDTO; message: string }>(`${this.baseUrl}/${id}`, itemData);
        return {
            item: ItemMapper.toDomain(data.item),
            message: data.message
        };
    }

    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`${this.baseUrl}/${id}`);
    }
}
