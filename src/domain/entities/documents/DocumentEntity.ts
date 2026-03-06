export interface DocumentStatus {
    id: number;
    name: string;
    key: string;
    color: string;
    icon: string;
    is_final: boolean;
}

export interface DocumentLineTax {
    id?: number;
    document_line_id?: number;
    tax_rate_id?: number;
    name?: string;
    percentage?: number;
    tax_operation?: string;
    base_amount?: number;
    tax_amount?: number;
}

export interface DocumentLine {
    id?: number;
    document_id?: number;
    item_id?: number | null;
    name: string;
    description: string | null;
    quantity: number;
    unit_price: number;
    discount_percentage: number;
    discount_amount: number;
    line_subtotal: number;
    tax_amount: number;
    line_total: number;
    taxes: DocumentLineTax[];
}

export interface DocumentTaxSummary {
    id?: number;
    document_id?: number;
    tax_rate_id?: number;
    name?: string;
    rate?: number;
    tax_operation?: string;
    base_amount: number;
    tax_amount: number;
}

export class DocumentEntity {
    constructor(
        public readonly id: number,
        public readonly company_id: number,
        public readonly operation: 'sale' | 'purchase',
        public readonly status: DocumentStatus,
        public readonly issue_date: string | null,
        public readonly due_date: string | null,
        public readonly number_serie: string | null,
        public readonly subtotal: number,
        public readonly tax_total: number,
        public readonly total: number,
        public readonly partner_id: number | null,
        public readonly partner_name: string | null,
        public readonly partner_email: string | null,
        public readonly partner_address: string | null,
        public readonly document_type_name: string | null,
        public readonly document_type_code: string | null,
        public readonly issue_date_raw: string | null,
        public readonly due_date_raw: string | null,
        public readonly number_series_id: number | null,
        public readonly notes: string | null,
        public readonly lines: DocumentLine[],
        public readonly tax_summaries: DocumentTaxSummary[]
    ) { }

    static fromJson(json: any): DocumentEntity {
        const contactList = Array.isArray(json.partner?.contact) ? json.partner.contact : [];
        const defaultContact = contactList.find((contact: any) => contact?.default);
        const fallbackContact = contactList[0];

        const lines: DocumentLine[] = Array.isArray(json.lines)
            ? json.lines.map((line: any) => ({
                id: line.id,
                document_id: line.document_id,
                item_id: line.item_id ?? null,
                name: line.name || '',
                description: line.description || null,
                quantity: Number(line.quantity ?? 0),
                unit_price: Number(line.unit_price ?? 0),
                discount_percentage: Number(line.discount_percentage ?? 0),
                discount_amount: Number(line.discount_amount ?? 0),
                line_subtotal: Number(line.line_subtotal ?? 0),
                tax_amount: Number(line.tax_amount ?? 0),
                line_total: Number(line.line_total ?? 0),
                taxes: Array.isArray(line.taxes)
                    ? line.taxes.map((tax: any) => ({
                        id: tax.id,
                        document_line_id: tax.document_line_id,
                        tax_rate_id: tax.tax_rate_id,
                        name: tax.name,
                        percentage: Number(tax.percentage ?? 0),
                        tax_operation: tax.tax_operation,
                        base_amount: Number(tax.base_amount ?? 0),
                        tax_amount: Number(tax.tax_amount ?? 0)
                    }))
                    : []
            }))
            : [];

        const tax_summaries: DocumentTaxSummary[] = Array.isArray(json.tax_summaries)
            ? json.tax_summaries.map((summary: any) => ({
                id: summary.id,
                document_id: summary.document_id,
                tax_rate_id: summary.tax_rate_id,
                name: summary.name,
                rate: Number(summary.rate ?? 0),
                tax_operation: summary.tax_operation,
                base_amount: Number(summary.base_amount ?? 0),
                tax_amount: Number(summary.tax_amount ?? 0)
            }))
            : [];

        return new DocumentEntity(
            Number(json.id),
            Number(json.company_id),
            json.operation,
            json.status,
            json.issue_date,
            json.due_date,
            json.number_serie,
            Number(json.subtotal ?? 0),
            Number(json.tax_total ?? 0),
            Number(json.total ?? 0),
            json.partner_id ? Number(json.partner_id) : null,
            json.partner?.name || json.partner_name || json.partner_snapshot?.name || null,
            defaultContact?.email || fallbackContact?.email || json.partner_snapshot?.email || null,
            json.partner?.address || json.partner_address || json.partner_snapshot?.address || null,
            json.document_type?.name || json.document_type_name || null,
            json.document_type?.code || json.document_type_code || null,
            json.issue_date || null,
            json.due_date || null,
            json.number_series_id ? Number(json.number_series_id) : null,
            json.notes || null,
            lines,
            tax_summaries
        );
    }
}
