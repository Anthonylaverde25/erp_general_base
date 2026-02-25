import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFileRepository } from '@/domain/repositories/files/IFileRepository';

@injectable()
export class ViewFileUseCase {
    constructor(@inject(TYPES.FileRepository) private repository: IFileRepository) { }

    async execute(id: number): Promise<{ blob: Blob; filename: string }> {
        return this.repository.view(id);
    }
}
