import { ItemEntity } from "@/domain/entities/items/ItemEntity";
import { ItemDTO } from "@/domain/entities/items/DTOs/ItemDTOs";

export class ItemMapper {
    static toDomain(dto: ItemDTO): ItemEntity {
        return ItemEntity.fromPrimitives(dto);
    }
}
