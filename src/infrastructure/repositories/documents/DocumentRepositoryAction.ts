import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';
import { IDocumentActionRepository } from '@/domain/entities/documents/repositories/document.action.repository';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class DocumentRepositoryAction implements IDocumentActionRepository {
    async convert(id: string | number, payload?: { 
        number_series_id?: number | ''; 
        status_key?: string;
        lines?: { source_line_id: number; quantity: number }[];
    }): Promise<DocumentEntity> {
        const {
            data: { data: invoice }
        } = await axiosInstance.post(`documents/${id}/convert`, payload);
        return DocumentEntity.fromJson(invoice);
    }

    async convertToPurchase(id: string | number): Promise<DocumentEntity> {
        const {
            data: { data: purchaseOrder }
        } = await axiosInstance.post(`documents/${id}/convert-to-purchase`);
        return DocumentEntity.fromJson(purchaseOrder);
    }

    async recordPayment(id: string | number, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string; allocations?: { document_id: number; amount: number }[] }): Promise<any> {
        const { data } = await axiosInstance.post(`documents/${id}/payments`, payload);
        return data;
    }

    async batchConvert(payload: { source_ids: (string | number)[]; number_series_id?: number | null; status_key?: string }): Promise<DocumentEntity> {
        const {
            data: { data: invoice }
        } = await axiosInstance.post(`documents/batch-convert`, payload);
        return DocumentEntity.fromJson(invoice);
    }

    async duplicate(id: string | number): Promise<DocumentEntity> {
        const {
            data: { data: duplicated }
        } = await axiosInstance.post(`documents/${id}/duplicate`);
        return DocumentEntity.fromJson(duplicated);
    }

    async rectify(id: string | number, payload?: { 
        number_series_id?: number | ''; 
        reason_id?: number;
        rectification_type_id?: number;
        rectification_modality_id?: number;
        notes?: string;
    }): Promise<DocumentEntity> {
        const {
            data: { data: rectified }
        } = await axiosInstance.post(`documents/${id}/rectify`, payload);
        return DocumentEntity.fromJson(rectified);
    }
}
