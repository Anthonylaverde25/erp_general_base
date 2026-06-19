import { CategoryDTO } from '@/domain/entities/categories/DTOs/CategoryDTOs';

export type ItemType = 'physical' | 'service';

export interface ItemPartner {
	id: number;
	name: string;
	is_default: boolean;
}

export interface ItemTaxRate {
	id: number;
	name: string;
	rate: number;
}

export interface ItemInventory {
	id: number;
	store_id: number;
	store_name: string;
	item_id: number;
	item_name?: string | null;
	quantity_on_hand: number;
	quantity_reserved: number;
	available_quantity: number;
	last_count_at?: string | null;
}

export interface ItemDTO {
	id: number;
	company_id?: number;
	sku: string;
	name: string;
	image?: string;
	type: ItemType;
	unit_id?: number;
	unit_name: string;
	category_id?: number;
	category_name?: string;
	subcategory_id?: number;
	family_id?: number;
	family_name?: string;
	category?: CategoryDTO;
	sale_price: number;
	purchase_price?: number;
	is_active: boolean;
	attributes?: Record<string, unknown>;
	tax_rates: ItemTaxRate[];
	inventory?: ItemInventory[];
	total_stock?: number;
	description?: string;
	store_id?: number | null;
	partner_id?: number | null;
	partner_name?: string | null;
	partners?: ItemPartner[];
	physical_profile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
		has_batches?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
		procurement_type?: 'buy' | 'make';
	} | null;
	service_profile?: {
		estimated_time?: number;
		req_scheduling?: boolean;
	} | null;
}

export interface CreateItemDTO {
	sku: string;
	name: string;
	type: ItemType;
	unit_id?: number;
	category_id?: number;
	family_id?: number;
	subcategory_id?: number;
	sale_price: number;
	purchase_price?: number;
	is_active: boolean;
	description?: string;
	tax_rate_ids?: number[];
	image?: File | null;
	store_id?: number | null;
	initial_stock?: number;
	quantity?: number;
	partner_ids?: number[];
	physical_profile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
		has_batches?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
		procurement_type?: 'buy' | 'make';
	};
	service_profile?: {
		estimated_time?: number;
		req_scheduling?: boolean;
	};
}

export interface UpdateItemDTO {
	sku?: string;
	name?: string;
	type?: ItemType;
	unit_id?: number;
	category_id?: number;
	family_id?: number;
	subcategory_id?: number;
	sale_price?: number;
	purchase_price?: number;
	is_active?: boolean;
	description?: string;
	tax_rate_ids?: number[];
	image?: File | null;
	store_id?: number | null;
	partner_ids?: number[];
	physical_profile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
		has_batches?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
		procurement_type?: 'buy' | 'make';
	};
	service_profile?: {
		estimated_time?: number;
		req_scheduling?: boolean;
	};
}
