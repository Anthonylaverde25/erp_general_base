import { Address } from "@/types/company.types";

export interface Store {
    id?: number;
    company_id?: number;
    name: string;
    code?: string;
    is_active: boolean;
    address?: Address;
}
