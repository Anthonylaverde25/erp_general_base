import { Container } from 'inversify';
import { TYPES } from '../types';
import { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';
import { ApiDocumentRepository } from '@/infrastructure/repositories/documents/ApiDocumentRepository';
import { IndexDocumentsUseCase } from '@/application/use_cases/documents/IndexDocumentsUseCase';
import { GetDocumentUseCase } from '@/application/use_cases/documents/GetDocumentUseCase';

export const registerDocumentModule = (container: Container) => {
    container.bind<DocumentRepositoryInterface>(TYPES.IDocumentRepository).to(ApiDocumentRepository);
    container.bind<IndexDocumentsUseCase>(TYPES.IndexDocumentsUseCase).to(IndexDocumentsUseCase);
    container.bind<GetDocumentUseCase>(TYPES.GetDocumentUseCase).to(GetDocumentUseCase);
};
