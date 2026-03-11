import type { IDocumentRepository } from '@/domain/entities/documents/repositories/document.interface.repository';
import { DocumentEntity } from '@/domain/entities/documents/DocumentEntity';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';

@injectable()
export class GetDocumentUseCase {
    constructor(
        @inject(TYPES.IDocumentRepository)
        private repository: IDocumentRepository
    ) { }

    async execute(id: string): Promise<DocumentEntity> {
        return await this.repository.show(id);
    }
}
