export interface IAddress {
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

export interface IContact {
	id?: number;
	email: string;
	phone?: string;
	default?: boolean;
}

export interface ICompany {
	id: number;
	name: string;
	cif?: string; // Added field from payload
	max_users?: number; // Maximum number of users allowed for this company
	brandColor?: string; // Corporate brand color
	addresses?: IAddress[]; // Changed from address string to Address array
	contacts?: IContact[]; // Added contacts array
	website?: string;
	logo_url?: string;
	favicon_url?: string;
	settings?: ICompanySetting;
	// Legacy fields - keeping optional just in case, or removing if strictly following new structure.
	// Given the request is to refactor for relations, I will prioritize the new structure.
}

export interface ICompanySetting {
	id?: number;
	maxUsers: number;
	maxStorageMb: number;
	currency: string;
	timezone: string;
	defaultStoreId?: number | null;
}
