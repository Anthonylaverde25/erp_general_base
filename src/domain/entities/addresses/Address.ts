import { IAddress } from '@/types/company.types';
import { CreateAddressDTO } from './DTOs/CreateAddressDTO';

export class AddressEntity implements IAddress {
	constructor(
		public id: number | undefined,
		public street: string,
		public city: string,
		public state: string,
		public postal_code: string,
		public country: string,
		public default_address: boolean,
		public street_2?: string | null,
		public county?: string | null
	) {}

	// Getter for interface compatibility
	get default(): boolean {
		return this.default_address;
	}

	static fromPrimitives(data: IAddress): AddressEntity {
		return new AddressEntity(
			data.id,
			data.street,
			data.city,
			data.state,
			data.postal_code,
			data.country,
			data.default,
			data.street_2,
			data.county
		);
	}

	static create(data: CreateAddressDTO): AddressEntity {
		return new AddressEntity(
			undefined,
			data.street,
			data.city,
			data.state,
			data.postal_code,
			data.country,
			data.default,
			data.street_2,
			data.county
		);
	}

	static update(id: number, data: Partial<AddressEntity>): AddressEntity {
		return new AddressEntity(
			id,
			data.street!,
			data.city!,
			data.state!,
			data.postal_code!,
			data.country!,
			data.default_address!,
			data.street_2,
			data.county
		);
	}

	toPlainObject(): IAddress {
		return {
			id: this.id,
			street: this.street,
			street_2: this.street_2,
			city: this.city,
			state: this.state,
			postal_code: this.postal_code,
			country: this.country,
			county: this.county,
			default: this.default_address
		};
	}
}
