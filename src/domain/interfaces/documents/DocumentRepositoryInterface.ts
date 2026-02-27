import { DocumentEntity } from '../../entities/documents/DocumentEntity';

export interface DocumentRepositoryInterface {
    index(filters: Record<string, any>): Promise<DocumentEntity[]>;
    show(id: string): Promise<DocumentEntity>;
}
