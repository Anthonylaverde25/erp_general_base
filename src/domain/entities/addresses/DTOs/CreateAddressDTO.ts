export interface CreateAddressDTO {
	id?: number;
	street: string;
	street_2?: string | null;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	county?: string | null;
	default: boolean;
}
