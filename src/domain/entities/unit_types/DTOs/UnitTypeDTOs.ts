export interface UnitTypeDTO {
    id: number;
    company_id: number;
    name: string;
    description: string | null;
    is_active: boolean;
}

export interface CreateUnitTypeDTO {
    name: string;
    description?: string | null;
    is_active?: boolean;
}

export interface UpdateUnitTypeDTO {
    name?: string;
    description?: string | null;
    is_active?: boolean;
}
