import { ItemEntity } from '../ItemEntity';
import type { PendingSerializationItem, RegisterSerialsPayload } from '@/types/pending-serialization.types';
import type { ItemSerialDTO, PaginatedItemSerials } from '@/types/item-serials.types';

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
	item?: { id: number; name: string; sku: string } | null;
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

	indexStockMovements(
		itemId?: number | null,
		page?: number,
		perPage?: number,
		filters?: { partner_id?: number | null; start_date?: string | null; end_date?: string | null }
	): Promise<PaginatedStockMovements>;

	indexPendingSerialization(): Promise<PendingSerializationItem[]>;

	registerItemSerials(id: number, data: RegisterSerialsPayload): Promise<{ message: string }>;

	indexItemSerials(
		page?: number,
		perPage?: number,
		filters?: {
			search?: string;
			status?: string;
			start_date?: string;
			end_date?: string;
			document_type?: string;
		}
	): Promise<PaginatedItemSerials>;
}

