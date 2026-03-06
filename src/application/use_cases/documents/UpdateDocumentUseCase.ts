import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class UpdateDocumentUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository)
        private repository: DocumentRepositoryInterface
    ) { }

    async execute(id: string, data: any): Promise<DocumentEntity> {
        return await this.repository.update(id, data);
    }
}
