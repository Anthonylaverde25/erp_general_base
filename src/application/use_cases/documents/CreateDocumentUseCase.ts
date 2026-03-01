import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class CreateDocumentUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository)
        private repository: DocumentRepositoryInterface
    ) { }

    async execute(data: any): Promise<DocumentEntity> {
        return await this.repository.create(data);
    }
}
