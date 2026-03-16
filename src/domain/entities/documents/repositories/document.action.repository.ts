import { DocumentEntity } from '../DocumentEntity';

export interface IDocumentActionRepository {
    convert(id: string | number, payload?: { 
        number_series_id?: number | ''; 
        status_key?: string;
        lines?: { source_line_id: number; quantity: number }[];
    }): Promise<DocumentEntity>;
    convertToPurchase(id: string | number): Promise<DocumentEntity>;
    recordPayment(id: string | number, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string }): Promise<any>;
    batchConvert(payload: { source_ids: (string | number)[]; number_series_id?: number | null; status_key?: string }): Promise<DocumentEntity>;
    duplicate(id: string | number): Promise<DocumentEntity>;
}
