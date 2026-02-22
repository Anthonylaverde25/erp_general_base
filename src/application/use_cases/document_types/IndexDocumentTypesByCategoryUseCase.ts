import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IDocumentTypeRepository } from '@/domain/entities/document_types/repositories/document-type.interface.repository';
import { DocumentTypeEntity } from '@/domain/entities/document_types/DocumentTypeEntity';

@injectable()
export class IndexDocumentTypesByCategoryUseCase implements IUseCase<string, DocumentTypeEntity[]> {
	constructor(
		@inject(TYPES.IDocumentTypeRepository)
		private readonly repository: IDocumentTypeRepository
	) {}

	async execute(category: string): Promise<DocumentTypeEntity[]> {
		return await this.repository.indexByCategory(category);
	}
}
