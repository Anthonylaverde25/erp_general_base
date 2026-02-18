import type { IItemRepository } from "@/domain/entities/items/repositories/item.repository";
import { CreateItemDTO } from "@/domain/entities/items/DTOs/ItemDTOs";
import { ItemEntity } from "@/domain/entities/items/ItemEntity";
import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";

@injectable()
export class CreateItemUseCase {
    constructor(@inject(TYPES.ItemRepository) private readonly itemRepository: IItemRepository) { }

    async execute(data: CreateItemDTO): Promise<{ item: ItemEntity; message: string }> {
        return this.itemRepository.create(data);
    }
}
