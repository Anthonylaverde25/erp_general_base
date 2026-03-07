import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { DocumentRepositoryInterface } from '@/domain/interfaces/documents/DocumentRepositoryInterface';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class ConvertDocumentUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository)
        private repository: DocumentRepositoryInterface
    ) { }

    async execute(id: string, payload?: { number_series_id?: number | ''; status_key?: string }): Promise<DocumentEntity> {
        return await this.repository.convert(id, payload);
    }
}
