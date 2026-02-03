export interface CreatePaymentMethodDTO {
    name: string;
    type: string;
    description?: string;
    details?: any;
    is_active?: boolean;
}
