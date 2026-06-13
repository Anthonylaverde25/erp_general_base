import { DocumentEntity } from '../DocumentEntity';

export interface IDocumentRepository {
    index(filters?: Record<string, any>): Promise<DocumentEntity[]>;
    indexPaginated(filters?: Record<string, any>): Promise<{ data: DocumentEntity[]; meta: any }>;
    indexAccounting(filters?: Record<string, any>): Promise<{ data: any[]; meta: any }>;
    show(id: string | number): Promise<DocumentEntity>;
    create(data: any): Promise<DocumentEntity>;
    update(id: string | number, data: any): Promise<DocumentEntity>;
    delete(id: string | number): Promise<void>;
}
