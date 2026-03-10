import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';
import { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class ApiDocumentRepository implements DocumentRepositoryInterface {
    async index(filters: Record<string, any> = {}): Promise<DocumentEntity[]> {
        const {
            data: { data }
        } = await axiosInstance.get('documents', { params: filters });
        return data.map((doc: any) => DocumentEntity.fromJson(doc));
    }

    async show(id: string): Promise<DocumentEntity> {
        const {
            data: { data }
        } = await axiosInstance.get(`documents/${id}`);
        return DocumentEntity.fromJson(data);
    }

    async create(data: any): Promise<DocumentEntity> {
        const {
            data: { data: createdDoc }
        } = await axiosInstance.post('documents', data);
        return DocumentEntity.fromJson(createdDoc);
    }

    async update(id: string, data: any): Promise<DocumentEntity> {
        const {
            data: { data: updatedDoc }
        } = await axiosInstance.put(`documents/${id}`, data);
        return DocumentEntity.fromJson(updatedDoc);
    }

    async convert(id: string, payload?: { number_series_id?: number | ''; status_key?: string }): Promise<DocumentEntity> {
        const {
            data: { data: invoice }
        } = await axiosInstance.post(`documents/${id}/convert`, payload);
        return DocumentEntity.fromJson(invoice);
    }

    async convertToPurchase(id: string): Promise<DocumentEntity> {
        const {
            data: { data: purchaseOrder }
        } = await axiosInstance.post(`documents/${id}/convert-to-purchase`);
        return DocumentEntity.fromJson(purchaseOrder);
    }

    async recordPayment(id: string, payload: { amount: number; payment_date: string; payment_method_id?: number; reference?: string; notes?: string }): Promise<any> {
        const { data } = await axiosInstance.post(`documents/${id}/payments`, payload);
        return data;
    }
}
