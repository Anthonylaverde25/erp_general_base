import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { IItemActionRepository, RegisterStockMovementDTO } from "@/domain/entities/items/repositories/item.action.repository";
import { ItemEntity } from "@/domain/entities/items/ItemEntity";
import { ItemMapper } from "@/infrastructure/mappers/items/ItemMapper";
import { ItemDTO } from "@/domain/entities/items/DTOs/ItemDTOs";

@injectable()
export class ItemRepositoryAction implements IItemActionRepository {
    private readonly baseUrl = "/items";

    async updateStockAlert(
        id: number,
        data: { has_stock_alert: boolean; stock_min: number | null }
    ): Promise<{ item: ItemEntity; message: string }> {
        const {
            data: { item, message },
        } = await axiosInstance.patch<{ item: ItemDTO; message: string }>(
            `${this.baseUrl}/${id}/stock-alert`,
            data
        );
        return {
            item: ItemMapper.toDomain(item),
            message: message || "Alarma de stock actualizada",
        };
    }

    async registerStockMovement(
        data: RegisterStockMovementDTO
    ): Promise<{ message: string }> {
        const {
            data: { message },
        } = await axiosInstance.post<{ message: string }>(
            "/stock-movements",
            data
        );
        return {
            message: message || "Movimiento de stock registrado",
        };
    }
}
