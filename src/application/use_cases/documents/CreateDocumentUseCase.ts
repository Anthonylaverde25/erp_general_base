import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IDocumentRepository } from '@/domain/entities/documents/repositories/document.interface.repository';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class CreateDocumentUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository)
        private repository: IDocumentRepository
    ) { }

    async execute(data: any): Promise<DocumentEntity> {
        return await this.repository.create(data);
    }
}
