import type { IDocumentRepository } from '@/domain/entities/documents/repositories/document.interface.repository';
import { DocumentEntity } from '../../../domain/entities/documents/DocumentEntity';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';

@injectable()
export class IndexDocumentsUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository) private repository: IDocumentRepository
    ) { }

    async execute(filters: Record<string, any> = {}): Promise<DocumentEntity[]> {
        return await this.repository.index(filters);
    }
}
