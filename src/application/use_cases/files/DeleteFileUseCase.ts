import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFileRepository } from '@/domain/repositories/files/IFileRepository';

@injectable()
export class DeleteFileUseCase {
    constructor(@inject(TYPES.FileRepository) private repository: IFileRepository) { }

    async execute(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}
