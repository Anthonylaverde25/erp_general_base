import { DocumentEntity } from '../../entities/documents/DocumentEntity';

export interface DocumentRepositoryInterface {
    index(filters: Record<string, any>): Promise<DocumentEntity[]>;
    show(id: string): Promise<DocumentEntity>;
    create(data: any): Promise<DocumentEntity>;
    update(id: string, data: any): Promise<DocumentEntity>;
    /** Converts a delivered/received delivery note into an invoice (atomic endpoint). */
    convert(id: string, payload?: { number_series_id?: number | ''; status_key?: string }): Promise<DocumentEntity>;
    /** Converts a Sales Quote into a Purchase Order (Draft). */
    convertToPurchase(id: string): Promise<DocumentEntity>;
    /** Records a payment for a document. */
    recordPayment(id: string, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string }): Promise<any>;
}
