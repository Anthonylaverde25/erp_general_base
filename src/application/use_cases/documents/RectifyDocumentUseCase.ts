import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IDocumentActionRepository } from '@/domain/entities/documents/repositories/document.action.repository';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';

@injectable()
export class RectifyDocumentUseCase {
    constructor(
        @inject(TYPES.IDocumentActionRepository)
        private repository: IDocumentActionRepository
    ) { }

    async execute(id: string, payload?: { 
        number_series_id?: number | ''; 
        reason_id?: number;
        rectification_type_id?: number;
        rectification_modality_id?: number;
        notes?: string;
        serial_comments?: Record<string, string>;
    }): Promise<DocumentEntity> {
        return await this.repository.rectify(id, payload);
    }
}
