import type { IItemRepository } from "@/domain/entities/items/repositories/item.repository";
import { UpdateItemDTO } from "@/domain/entities/items/DTOs/ItemDTOs";
import { ItemEntity } from "@/domain/entities/items/ItemEntity";
import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";

@injectable()
export class UpdateItemUseCase {
    constructor(@inject(TYPES.ItemRepository) private readonly itemRepository: IItemRepository) { }

    async execute(id: number, data: UpdateItemDTO): Promise<{ item: ItemEntity; message: string }> {
        const item = ItemEntity.update(id, data);
        return this.itemRepository.update(id, item);
    }
}
