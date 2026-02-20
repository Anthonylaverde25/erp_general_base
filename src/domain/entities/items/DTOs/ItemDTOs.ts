import { CategoryDTO } from '@/domain/entities/categories/DTOs/CategoryDTOs';

export type ItemType = 'physical' | 'service';

export interface ItemTaxRate {
	id: number;
	name: string;
	rate: number;
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
	family_id?: number;
	family_name?: string;
	category?: CategoryDTO;
	sale_price: number;
	purchase_price?: number;
	is_active: boolean;
	attributes?: Record<string, unknown>;
	tax_rates: ItemTaxRate[];
	description?: string;
	physical_profile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
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
	default_supplier_id?: number | null;
	physical_profile?: {
		barcode?: string;
		weight?: number;
		dimensions?: Record<string, unknown>;
		is_inventoriable?: boolean;
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
	default_supplier_id?: number | null;
}
