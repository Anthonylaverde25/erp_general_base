import { ISerialReturn, IItemSerial, IItemReturnReason } from '@/types/serial-returns.types';

export class ItemSerialReturnEntity implements ISerialReturn {
	constructor(
		public id: number,
		public item_serial_id: number,
		public document_id: number,
		public item_return_reason_id: number | null,
		public customer_notes: string | null,
		public is_processed: boolean,
		public processed_by: number | null,
		public processed_at: string | null,
		public technical_notes: string | null,
		public created_at: string,
		public updated_at: string,
		public item_serial?: IItemSerial,
		public document?: {
			id: number;
			number_serie: string | null;
			notes: string | null;
			document_type?: {
				code: string;
				name: string;
			};
		},
		public reason?: IItemReturnReason,
		public processed_by_user?: {
			id: number;
			name: string;
		}
	) {}

	static fromPrimitives(data: ISerialReturn): ItemSerialReturnEntity {
		return new ItemSerialReturnEntity(
			data.id,
			data.item_serial_id,
			data.document_id,
			data.item_return_reason_id ?? null,
			data.customer_notes ?? null,
			data.is_processed,
			data.processed_by ?? null,
			data.processed_at ?? null,
			data.technical_notes ?? null,
			data.created_at,
			data.updated_at,
			data.item_serial,
			data.document,
			data.reason,
			data.processed_by_user
		);
	}

	toPlainObject(): ISerialReturn {
		return {
			id: this.id,
			item_serial_id: this.item_serial_id,
			document_id: this.document_id,
			item_return_reason_id: this.item_return_reason_id,
			customer_notes: this.customer_notes,
			is_processed: this.is_processed,
			processed_by: this.processed_by,
			processed_at: this.processed_at,
			technical_notes: this.technical_notes,
			created_at: this.created_at,
			updated_at: this.updated_at,
			item_serial: this.item_serial,
			document: this.document,
			reason: this.reason,
			processed_by_user: this.processed_by_user
		};
	}
}
