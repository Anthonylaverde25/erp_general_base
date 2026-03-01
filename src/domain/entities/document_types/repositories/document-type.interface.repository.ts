import { DocumentTypeEntity } from '../DocumentTypeEntity';

export interface IDocumentTypeRepository {
	index(): Promise<DocumentTypeEntity[]>;
	indexByModule(module: string): Promise<DocumentTypeEntity[]>;
}
