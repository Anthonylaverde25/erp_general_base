import { CategoryDTO } from "@/domain/entities/categories/DTOs/CategoryDTOs";

export type ItemType = 'physical' | 'service';

export interface ItemTaxRate {
    id: number;
    name: string;
    rate: number;
}

export interface ItemDTO {
    id: number;
    sku: string;
    name: string;
    type: ItemType;
    unit_name: string;
    // category_name: string; // Removed in favor of category object
    category: CategoryDTO;
    sale_price: number;
    is_active: boolean;
    tax_rates: ItemTaxRate[];
    description?: string;
    purchase_price?: number;
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
}
