import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';
import { IDocumentActionRepository } from '@/domain/entities/documents/repositories/document.action.repository';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class DocumentRepositoryAction implements IDocumentActionRepository {
    async convert(id: string | number, payload?: { number_series_id?: number | ''; status_key?: string }): Promise<DocumentEntity> {
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

    async recordPayment(id: string | number, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string }): Promise<any> {
        const { data } = await axiosInstance.post(`documents/${id}/payments`, payload);
        return data;
    }
}
