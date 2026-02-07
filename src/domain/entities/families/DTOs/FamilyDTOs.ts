export interface FamilyDTO {
    id: number;
    company_id: number;
    tax_rate_ids: number[];
    name: string;
    percentage: number;
    is_active: boolean;
    tax_rates?: any[]; // We can improve this type if we import TaxRateDTO
}

export interface CreateFamilyDTO {
    name: string;
    tax_rate_ids: number[];
    percentage: number;
    is_active: boolean;
}

export interface UpdateFamilyDTO {
    name?: string;
    tax_rate_ids?: number[];
    percentage?: number;
    is_active?: boolean;
}
