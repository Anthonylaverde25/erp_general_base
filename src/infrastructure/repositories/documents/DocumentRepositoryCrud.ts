import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';
import { IDocumentRepository } from '@/domain/entities/documents/repositories/document.interface.repository';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class DocumentRepositoryCrud implements IDocumentRepository {
    async index(filters: Record<string, any> = {}): Promise<DocumentEntity[]> {
        const {
            data: { data }
        } = await axiosInstance.get('documents', { params: filters });
        return data.map((doc: any) => DocumentEntity.fromJson(doc));
    }

    async show(id: string | number): Promise<DocumentEntity> {
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

    async update(id: string | number, data: any): Promise<DocumentEntity> {
        const {
            data: { data: updatedDoc }
        } = await axiosInstance.put(`documents/${id}`, data);
        return DocumentEntity.fromJson(updatedDoc);
    }

    async delete(id: string | number): Promise<void> {
        await axiosInstance.delete(`documents/${id}`);
    }
}
