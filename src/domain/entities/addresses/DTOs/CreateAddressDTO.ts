export interface CreateAddressDTO {
	street: string;
	street_2?: string | null;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	default: boolean;
}
