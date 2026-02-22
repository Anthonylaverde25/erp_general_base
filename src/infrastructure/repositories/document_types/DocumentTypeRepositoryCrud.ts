import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { IDocumentTypeRepository } from '@/domain/entities/document_types/repositories/document-type.interface.repository';
import { DocumentTypeEntity } from '@/domain/entities/document_types/DocumentTypeEntity';
import { DocumentTypeMapper } from '@/domain/entities/document_types/Mappers/DocumentTypeMapper';

@injectable()
export class DocumentTypeRepositoryCrud implements IDocumentTypeRepository {
	async index(): Promise<DocumentTypeEntity[]> {
		const {
			data: { document_types }
		} = await axiosInstance.get(`document-types`);
		return DocumentTypeMapper.fromDetailDTOList(document_types);
	}

	async indexByCategory(category: string): Promise<DocumentTypeEntity[]> {
		const {
			data: { document_types }
		} = await axiosInstance.get(`document-types/by-category/${category}`);
		return DocumentTypeMapper.fromDetailDTOList(document_types);
	}
}
