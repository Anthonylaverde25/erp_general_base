
export interface PaymentEntity {
    id: number;
    amount: number;
    payment_date: string;
    reference: string | null;
    notes: string | null;
    payment_method_id: number | null;
    payment_method_name: string | null;
    created_by: string | null;
    created_at: string;
}

export class PaymentEntityMapper {
    static fromJson(json: any): PaymentEntity {
        return {
            id: Number(json.id),
            amount: Number(json.amount || 0),
            payment_date: json.payment_date,
            reference: json.reference || null,
            notes: json.notes || null,
            payment_method_id: json.payment_method_id ? Number(json.payment_method_id) : null,
            payment_method_name: json.payment_method_name || null,
            created_by: json.created_by || null,
            created_at: json.created_at,
        };
    }
}
