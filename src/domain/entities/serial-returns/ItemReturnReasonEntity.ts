import { IItemReturnReason } from '@/types/serial-returns.types';

export class ItemReturnReasonEntity implements IItemReturnReason {
	constructor(
		public id: number,
		public name: string,
		public is_active: boolean
	) {}

	static fromPrimitives(data: IItemReturnReason): ItemReturnReasonEntity {
		return new ItemReturnReasonEntity(data.id, data.name, data.is_active ?? true);
	}

	toPlainObject(): IItemReturnReason {
		return {
			id: this.id,
			name: this.name,
			is_active: this.is_active
		};
	}
}
