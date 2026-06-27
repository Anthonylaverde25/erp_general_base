export interface IItemReturnReason {
	id: number;
	name: string;
	is_active: boolean;
}

export interface IItemSerial {
	id: number;
	item_id: number;
	batch_id: number | null;
	serial_number: string;
	store_id: number | null;
	status: 'available' | 'reserved' | 'sold' | 'damaged' | 'maintenance' | 'under_review';
	purchase_line_id: number | null;
	sale_line_id: number | null;
	created_at: string;
	updated_at: string;
	item?: {
		id: number;
		name: string;
		sku: string;
	};
}

export interface ISerialReturn {
	id: number;
	item_serial_id: number;
	document_id: number;
	item_return_reason_id: number | null;
	customer_notes: string | null;
	is_processed: boolean;
	processed_by: number | null;
	processed_at: string | null;
	technical_notes: string | null;
	created_at: string;
	updated_at: string;
	item_serial?: IItemSerial;
	document?: {
		id: number;
		number_serie: string | null;
		notes: string | null;
		document_type?: {
			code: string;
			name: string;
		};
	};
	reason?: IItemReturnReason;
	processed_by_user?: {
		id: number;
		name: string;
	};
}

export interface IProcessSerialReturnPayload {
	decision: 'approve' | 'reject';
	item_return_reason_id: number;
	technical_notes: string | null;
}
