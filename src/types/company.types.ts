export interface Address {
    id?: number;
    street: string;
    street_2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    default: boolean;
}

export interface Contact {
    id?: number;
    email: string;
    phone?: string;
    default?: boolean;
}

export interface Company {
    id: number;
    name: string;
    cif?: string; // Added field from payload
    max_users?: number; // Maximum number of users allowed for this company
    brandColor?: string; // Corporate brand color
    addresses?: Address[]; // Changed from address string to Address array
    contacts?: Contact[]; // Added contacts array
    website?: string;
    logo_url?: string;
    // Legacy fields - keeping optional just in case, or removing if strictly following new structure. 
    // Given the request is to refactor for relations, I will prioritize the new structure.
}

export type ActiveCompany = Company;
