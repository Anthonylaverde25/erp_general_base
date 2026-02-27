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
}
