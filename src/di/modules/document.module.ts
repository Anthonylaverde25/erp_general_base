import { Container } from 'inversify';
import { TYPES } from '../types';
import { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';
import { ApiDocumentRepository } from '@/infrastructure/repositories/documents/ApiDocumentRepository';
import { IndexDocumentsUseCase } from '@/application/use_cases/documents/IndexDocumentsUseCase';
import { GetDocumentUseCase } from '@/application/use_cases/documents/GetDocumentUseCase';
import { CreateDocumentUseCase } from '@/application/use_cases/documents/CreateDocumentUseCase';
import { UpdateDocumentUseCase } from '@/application/use_cases/documents/UpdateDocumentUseCase';
import { ConvertDocumentUseCase } from '@/application/use_cases/documents/ConvertDocumentUseCase';
import { ConvertToPurchaseUseCase } from '@/application/use_cases/documents/ConvertToPurchaseUseCase';
import { RecordPaymentUseCase } from '@/application/use_cases/documents/RecordPaymentUseCase';

export const registerDocumentModule = (container: Container) => {
    container.bind<DocumentRepositoryInterface>(TYPES.IDocumentRepository).to(ApiDocumentRepository).inSingletonScope();
    container.bind<IndexDocumentsUseCase>(TYPES.IndexDocumentsUseCase).to(IndexDocumentsUseCase);
    container.bind<GetDocumentUseCase>(TYPES.GetDocumentUseCase).to(GetDocumentUseCase);
    container.bind<CreateDocumentUseCase>(TYPES.CreateDocumentUseCase).to(CreateDocumentUseCase);
    container.bind<UpdateDocumentUseCase>(TYPES.UpdateDocumentUseCase).to(UpdateDocumentUseCase);
    container.bind<ConvertDocumentUseCase>(TYPES.ConvertDocumentUseCase).to(ConvertDocumentUseCase);
    container.bind<ConvertToPurchaseUseCase>(TYPES.ConvertToPurchaseUseCase).to(ConvertToPurchaseUseCase);
    container.bind<RecordPaymentUseCase>(TYPES.RecordPaymentUseCase).to(RecordPaymentUseCase);
};
