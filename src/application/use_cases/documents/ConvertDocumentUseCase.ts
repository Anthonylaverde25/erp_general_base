import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IDocumentActionRepository } from '@/domain/entities/documents/repositories/document.action.repository';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class ConvertDocumentUseCase {
    constructor(
        @inject(TYPES.IDocumentActionRepository)
        private repository: IDocumentActionRepository
    ) { }

    async execute(id: string, payload?: { number_series_id?: number | ''; status_key?: string }): Promise<DocumentEntity> {
        return await this.repository.convert(id, payload);
    }
}
