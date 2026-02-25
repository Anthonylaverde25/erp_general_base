import { injectable, inject } from 'inversify';
import type { IFileRepository } from '@/domain/repositories/files/IFileRepository';
import { TYPES } from '@/di/types';

@injectable()
export class PreviewJsonFileUseCase {
    constructor(
        @inject(TYPES.FileRepository) private readonly repository: IFileRepository
    ) { }

    async execute(id: number): Promise<{ data: any[]; total_rows: number }> {
        return this.repository.previewJson(id);
    }
}
