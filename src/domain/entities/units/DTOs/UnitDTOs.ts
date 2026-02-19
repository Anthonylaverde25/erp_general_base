export interface UnitDTO {
    id: number;
    company_id: number;
    unit_type_id: number;
    code: string;
    name: string;
    unit_type?: {
        id: number;
        name: string;
        applicability: 'physical' | 'service' | 'both';
    };
}

export interface CreateUnitDTO {
    unit_type_id: number;
    code: string;
    name: string;
}

export interface UpdateUnitDTO {
    unit_type_id?: number;
    code?: string;
    name?: string;
}
