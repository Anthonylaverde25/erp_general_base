export interface IBatch {
	id: number;
	item_id: number;
	internal_batch_number: string;
	supplier_batch_number: string | null;
	partner_id: number | null;
	manufactured_date: string | null;
	expiry_date: string | null;
	status: 'active' | 'quarantine' | 'expired';
	attributes: any | null;
	created_at?: string;
	updated_at?: string;
	item_name?: string;
	item_sku?: string;
	current_stock?: number;
	partner_name?: string;
	item_procurement_type?: 'buy' | 'make';
}

export interface IUpdateBatch {
	supplier_batch_number: string | null;
	manufactured_date: string | null;
	expiry_date: string | null;
	status: 'active' | 'quarantine' | 'expired';
}
