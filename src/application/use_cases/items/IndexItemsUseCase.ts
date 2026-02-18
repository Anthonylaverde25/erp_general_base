import type { IItemRepository } from "@/domain/entities/items/repositories/item.repository";
import { ItemEntity } from "@/domain/entities/items/ItemEntity";
import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";

@injectable()
export class IndexItemsUseCase {
    constructor(@inject(TYPES.ItemRepository) private readonly itemRepository: IItemRepository) { }

    async execute(): Promise<ItemEntity[]> {
        return this.itemRepository.index();
    }
}
