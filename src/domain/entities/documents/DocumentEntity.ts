export class DocumentEntity {
    constructor(
        public readonly id: number,
        public readonly company_id: number,
        public readonly operation: 'sale' | 'purchase',
        public readonly status: string,
        public readonly issue_date: string | null,
        public readonly due_date: string | null,
        public readonly number_serie: string | null,
        public readonly subtotal: number,
        public readonly tax_total: number,
        public readonly total: number,
        public readonly partner_name: string | null,
        public readonly document_type_name: string | null
    ) { }

    static fromJson(json: any): DocumentEntity {
        return new DocumentEntity(
            json.id,
            json.company_id,
            json.operation,
            json.status,
            json.issue_date,
            json.due_date,
            json.number_serie,
            json.subtotal,
            json.tax_total,
            json.total,
            json.partner?.name || json.partner_snapshot?.name || null,
            json.document_type?.name || null
        );
    }
}
