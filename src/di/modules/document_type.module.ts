import { Container } from 'inversify';
import { TYPES } from '../types';
import { IDocumentTypeRepository } from '@/domain/entities/document_types/repositories/document-type.interface.repository';
import { DocumentTypeRepositoryCrud } from '@/infrastructure/repositories/document_types/DocumentTypeRepositoryCrud';
import { IndexDocumentTypesUseCase } from '@/application/use_cases/document_types/IndexDocumentTypesUseCase';
import { IndexDocumentTypesByModuleUseCase } from '@/application/use_cases/document_types/IndexDocumentTypesByModuleUseCase';
import { IndexDocumentTypesByCategoryUseCase } from '@/application/use_cases/document_types/IndexDocumentTypesByCategoryUseCase';

export function registerDocumentTypeModule(container: Container) {
	// Repository
	container.bind<IDocumentTypeRepository>(TYPES.IDocumentTypeRepository).to(DocumentTypeRepositoryCrud);

	// Use Cases
	container.bind<IndexDocumentTypesUseCase>(TYPES.IndexDocumentTypesUseCase).to(IndexDocumentTypesUseCase);
	container
		.bind<IndexDocumentTypesByModuleUseCase>(TYPES.IndexDocumentTypesByModuleUseCase)
		.to(IndexDocumentTypesByModuleUseCase);
	container
		.bind<IndexDocumentTypesByCategoryUseCase>(TYPES.IndexDocumentTypesByCategoryUseCase)
		.to(IndexDocumentTypesByCategoryUseCase);
}
