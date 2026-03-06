import { DocumentTypeEntity } from '../DocumentTypeEntity';
import { DocumentStatus } from '../../documents/DocumentEntity';

export interface IDocumentTypeRepository {
	index(): Promise<DocumentTypeEntity[]>;
	indexByModule(module: string): Promise<DocumentTypeEntity[]>;
	getStatusesByCode(code: string): Promise<DocumentStatus[]>;
}
