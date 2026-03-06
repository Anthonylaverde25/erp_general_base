import { Container } from 'inversify';
import { TYPES } from '../types';
import { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';
import { ApiDocumentRepository } from '@/infrastructure/repositories/documents/ApiDocumentRepository';
import { IndexDocumentsUseCase } from '@/application/use_cases/documents/IndexDocumentsUseCase';
import { GetDocumentUseCase } from '@/application/use_cases/documents/GetDocumentUseCase';
import { CreateDocumentUseCase } from '@/application/use_cases/documents/CreateDocumentUseCase';
import { UpdateDocumentUseCase } from '@/application/use_cases/documents/UpdateDocumentUseCase';

export const registerDocumentModule = (container: Container) => {
    container.bind<DocumentRepositoryInterface>(TYPES.IDocumentRepository).to(ApiDocumentRepository).inSingletonScope();
    container.bind<IndexDocumentsUseCase>(TYPES.IndexDocumentsUseCase).to(IndexDocumentsUseCase);
    container.bind<GetDocumentUseCase>(TYPES.GetDocumentUseCase).to(GetDocumentUseCase);
    container.bind<CreateDocumentUseCase>(TYPES.CreateDocumentUseCase).to(CreateDocumentUseCase);
    container.bind<UpdateDocumentUseCase>(TYPES.UpdateDocumentUseCase).to(UpdateDocumentUseCase);
};
