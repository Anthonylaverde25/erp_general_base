import { ItemEntity } from "../ItemEntity";

export interface RegisterStockMovementDTO {
    item_id: number;
    source_store_id?: number | null;
    destination_store_id: number;
    quantity: number;
    type: string;
    reason?: string;
    reference?: string | null;
    notes?: string | null;
}

export interface AdjustStockEntryDTO {
    item_id: number;
    destination_store_id: number;
    quantity: number;
    reason: string;
    reference?: string | null;
    notes?: string | null;
    client_timestamp: string;
}

export interface IItemActionRepository {
    updateStockAlert(
        id: number,
        data: { has_stock_alert: boolean; stock_min: number | null }
    ): Promise<{ item: ItemEntity; message: string }>;

    registerStockMovement(
        data: RegisterStockMovementDTO
    ): Promise<{ message: string }>;

    adjustStockEntry(
        data: AdjustStockEntryDTO
    ): Promise<{ message: string; server_timestamp: string }>;
}
