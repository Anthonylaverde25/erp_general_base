import { DocumentEntity } from '../DocumentEntity';

export interface IDocumentRepository {
    index(filters?: Record<string, any>): Promise<DocumentEntity[]>;
    show(id: string | number): Promise<DocumentEntity>;
    create(data: any): Promise<DocumentEntity>;
    update(id: string | number, data: any): Promise<DocumentEntity>;
    delete(id: string | number): Promise<void>;
}
