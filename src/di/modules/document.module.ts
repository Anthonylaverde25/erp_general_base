import { Container } from 'inversify';
import { TYPES } from '../types';
import { IDocumentRepository } from '@/domain/entities/documents/repositories/document.interface.repository';
import { IDocumentActionRepository } from '@/domain/entities/documents/repositories/document.action.repository';
import { DocumentRepositoryCrud } from '@/infrastructure/repositories/documents/DocumentRepositoryCrud';
import { DocumentRepositoryAction } from '@/infrastructure/repositories/documents/DocumentRepositoryAction';
import { IndexDocumentsUseCase } from '@/application/use_cases/documents/IndexDocumentsUseCase';
import { GetDocumentUseCase } from '@/application/use_cases/documents/GetDocumentUseCase';
import { CreateDocumentUseCase } from '@/application/use_cases/documents/CreateDocumentUseCase';
import { UpdateDocumentUseCase } from '@/application/use_cases/documents/UpdateDocumentUseCase';
import { ConvertDocumentUseCase } from '@/application/use_cases/documents/ConvertDocumentUseCase';
import { ConvertToPurchaseUseCase } from '@/application/use_cases/documents/ConvertToPurchaseUseCase';
import { RecordPaymentUseCase } from '@/application/use_cases/documents/RecordPaymentUseCase';

export const registerDocumentModule = (container: Container) => {
    container.bind<IDocumentRepository>(TYPES.IDocumentRepository).to(DocumentRepositoryCrud).inSingletonScope();
    container.bind<IDocumentActionRepository>(TYPES.IDocumentActionRepository).to(DocumentRepositoryAction).inSingletonScope();
    container.bind<IndexDocumentsUseCase>(TYPES.IndexDocumentsUseCase).to(IndexDocumentsUseCase);
    container.bind<GetDocumentUseCase>(TYPES.GetDocumentUseCase).to(GetDocumentUseCase);
    container.bind<CreateDocumentUseCase>(TYPES.CreateDocumentUseCase).to(CreateDocumentUseCase);
    container.bind<UpdateDocumentUseCase>(TYPES.UpdateDocumentUseCase).to(UpdateDocumentUseCase);
    container.bind<ConvertDocumentUseCase>(TYPES.ConvertDocumentUseCase).to(ConvertDocumentUseCase);
    container.bind<ConvertToPurchaseUseCase>(TYPES.ConvertToPurchaseUseCase).to(ConvertToPurchaseUseCase);
    container.bind<RecordPaymentUseCase>(TYPES.RecordPaymentUseCase).to(RecordPaymentUseCase);
};
