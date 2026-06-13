import { DocumentEntity } from '../DocumentEntity';

export interface IDocumentActionRepository {
    convert(id: string | number, payload?: { 
        number_series_id?: number | ''; 
        status_key?: string;
        lines?: { source_line_id: number; quantity: number }[];
    }): Promise<DocumentEntity>;
    convertToPurchase(id: string | number): Promise<DocumentEntity>;
    recordPayment(id: string | number, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string; allocations?: { document_id: number; amount: number }[] }): Promise<any>;
    batchConvert(payload: { source_ids: (string | number)[]; number_series_id?: number | null; status_key?: string }): Promise<DocumentEntity>;
    duplicate(id: string | number): Promise<DocumentEntity>;
    rectify(id: string | number, payload?: { 
        number_series_id?: number | ''; 
        reason_id?: number;
        rectification_type_id?: number;
        rectification_modality_id?: number;
        notes?: string;
    }): Promise<DocumentEntity>;
}
