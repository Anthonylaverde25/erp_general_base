export interface Company {
    id: number;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    logo_url?: string;
}

export type ActiveCompany = Company;
