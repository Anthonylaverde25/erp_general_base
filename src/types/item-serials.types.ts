export interface ItemSerialDTO {
	id: number;
	serial_number: string;
	status: 'available' | 'sold' | 'damaged' | 'returned' | string;
	item_id: number;
	item_name: string;
	item_sku: string;
	store_id: number | null;
	store_name: string | null;
	purchase_line_id: number | null;
	purchase_doc_number: string | null;
	sale_line_id: number | null;
	sale_doc_number: string | null;
	created_at: string;
}

export interface PaginatedItemSerials {
	data: ItemSerialDTO[];
	meta: {
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
}
