export interface PaymentMethod {
    id?: number;
    company_id?: number;
    name: string;
    type: string;
    description?: string;
    details?: any;
    is_active: boolean;
}
