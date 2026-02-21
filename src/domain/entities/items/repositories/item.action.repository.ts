import { ItemEntity } from "../ItemEntity";

export interface IItemActionRepository {
    updateStockAlert(
        id: number,
        data: { has_stock_alert: boolean; stock_min: number | null }
    ): Promise<{ item: ItemEntity; message: string }>;
}
