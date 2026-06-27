export interface PendingSerializationItem {
    id: number;
    name: string;
    sku: string;
    store_id: number;
    store_name: string;
    physical_stock: number;
    serials_count: number;
    pending_count: number;
}

export interface RegisterSerialsPayload {
    store_id: number;
    serial_numbers: string[];
}
