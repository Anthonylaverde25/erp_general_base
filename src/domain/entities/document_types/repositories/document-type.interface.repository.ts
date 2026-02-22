import { DocumentTypeEntity } from '../DocumentTypeEntity';

export interface IDocumentTypeRepository {
	index(): Promise<DocumentTypeEntity[]>;
	indexByCategory(category: string): Promise<DocumentTypeEntity[]>;
}
