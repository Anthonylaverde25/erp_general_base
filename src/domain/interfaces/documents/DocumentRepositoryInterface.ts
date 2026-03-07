import { DocumentEntity } from '../../entities/documents/DocumentEntity';

export interface DocumentRepositoryInterface {
    index(filters: Record<string, any>): Promise<DocumentEntity[]>;
    show(id: string): Promise<DocumentEntity>;
    create(data: any): Promise<DocumentEntity>;
    update(id: string, data: any): Promise<DocumentEntity>;
    /** Converts a delivered/received delivery note into an invoice (atomic endpoint). */
    convert(id: string, payload?: { number_series_id?: number | ''; status_key?: string }): Promise<DocumentEntity>;
}
