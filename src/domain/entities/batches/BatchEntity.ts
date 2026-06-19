import { IBatch } from '@/types/batch.types';

export class BatchEntity implements IBatch {
	constructor(
		public id: number,
		public item_id: number,
		public internal_batch_number: string,
		public supplier_batch_number: string | null,
		public partner_id: number | null,
		public manufactured_date: string | null,
		public expiry_date: string | null,
		public status: 'active' | 'quarantine' | 'expired',
		public attributes: any | null,
		public created_at?: string,
		public updated_at?: string,
		public item_name?: string,
		public item_sku?: string,
		public current_stock?: number,
		public partner_name?: string,
		public item_procurement_type?: 'buy' | 'make'
	) {}

	static fromPrimitives(data: IBatch): BatchEntity {
		return new BatchEntity(
			data.id,
			data.item_id,
			data.internal_batch_number,
			data.supplier_batch_number ?? null,
			data.partner_id ?? null,
			data.manufactured_date ?? null,
			data.expiry_date ?? null,
			data.status,
			data.attributes ?? null,
			data.created_at,
			data.updated_at,
			data.item_name,
			data.item_sku,
			data.current_stock ?? 0,
			data.partner_name,
			data.item_procurement_type
		);
	}

	toPlainObject(): IBatch {
		return {
			id: this.id,
			item_id: this.item_id,
			internal_batch_number: this.internal_batch_number,
			supplier_batch_number: this.supplier_batch_number,
			partner_id: this.partner_id,
			manufactured_date: this.manufactured_date,
			expiry_date: this.expiry_date,
			status: this.status,
			attributes: this.attributes,
			created_at: this.created_at,
			updated_at: this.updated_at,
			item_name: this.item_name,
			item_sku: this.item_sku,
			current_stock: this.current_stock,
			partner_name: this.partner_name,
			item_procurement_type: this.item_procurement_type
		};
	}
}
