import { ItemEntity } from '../ItemEntity';

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
	reason?: string;
	reference?: string | null;
	notes?: string | null;
	client_timestamp: string;
}

export interface StockMovementUserDTO {
	id: number;
	name: string;
	email: string;
}

export interface StockMovementStoreDTO {
	id: number;
	name: string;
}

export interface StockMovementEntity {
	id: number;
	item_id: number;
	quantity: number;
	type: 'entry' | 'exit';
	reason: string;
	reference: string | null;
	notes: string | null;
	created_at: string;
	user: StockMovementUserDTO;
	source_store?: StockMovementStoreDTO | null;
	destination_store?: StockMovementStoreDTO | null;
}

export interface PaginatedStockMovements {
	data: StockMovementEntity[];
	meta: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
}

export interface IItemActionRepository {
	updateStockAlert(
		id: number,
		data: { has_stock_alert: boolean; stock_min: number | null }
	): Promise<{ item: ItemEntity; message: string }>;

	registerStockMovement(data: RegisterStockMovementDTO): Promise<{ message: string }>;

	adjustStockEntry(data: AdjustStockEntryDTO): Promise<{ message: string; server_timestamp: string }>;

	indexStockMovements(itemId: number, page?: number, perPage?: number): Promise<PaginatedStockMovements>;
}
