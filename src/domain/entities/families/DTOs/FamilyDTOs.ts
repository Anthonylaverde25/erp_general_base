export interface FamilyDTO {
    id: number;
    company_id: number;
    tax_rate_id: number;
    name: string;
    percentage: number;
    is_active: boolean;
    tax_rate?: any; // We can improve this type if we import TaxRateDTO
}

export interface CreateFamilyDTO {
    name: string;
    tax_rate_id: number;
    percentage: number;
    is_active: boolean;
}

export interface UpdateFamilyDTO {
    name?: string;
    tax_rate_id?: number;
    percentage?: number;
    is_active?: boolean;
}
