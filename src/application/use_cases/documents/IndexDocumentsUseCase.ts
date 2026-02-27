import type { DocumentRepositoryInterface } from '../../../domain/interfaces/documents/DocumentRepositoryInterface';
import { DocumentEntity } from '../../../domain/entities/documents/DocumentEntity';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';

@injectable()
export class IndexDocumentsUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository) private repository: DocumentRepositoryInterface
    ) { }

    async execute(filters: Record<string, any> = {}): Promise<DocumentEntity[]> {
        return await this.repository.index(filters);
    }
}
