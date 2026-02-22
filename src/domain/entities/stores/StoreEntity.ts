import { Store } from '@/types/store.types';
import { CreateStoreDTO } from './DTOs/CreateStoreDTO';
import { IAddress } from '@/types/company.types';

export class StoreEntity implements Store {
	constructor(
		public id: number | undefined,
		public company_id: number | undefined,
		public name: string,
		public code: string | undefined,
		public is_active: boolean,
		public address?: IAddress
	) {}

	static fromPrimitives(data: Store): StoreEntity {
		return new StoreEntity(data.id, data.company_id, data.name, data.code, data.is_active ?? true, data.address);
	}

	static create(data: CreateStoreDTO): StoreEntity {
		return new StoreEntity(
			undefined,
			undefined,
			data.name,
			data.code,
			data.is_active ?? true,
			// Address creation logic should be handled by repository transformation if needed,
			// but for entity structure we keep it undefined for now or map it if DTO had it.
			// Since DTO has CreateAddressDTO, not Address entity, we leave it undefined here
			// as this method is usually for local optimistic creation or similar.
			undefined
		);
	}

	toPlainObject(): Store {
		return {
			id: this.id,
			company_id: this.company_id,
			name: this.name,
			code: this.code,
			is_active: this.is_active,
			address: this.address
		};
	}
}
