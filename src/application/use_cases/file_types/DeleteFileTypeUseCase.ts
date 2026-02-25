import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFileTypeRepository } from '@/domain/repositories/file_types/IFileTypeRepository';

@injectable()
export class DeleteFileTypeUseCase {
    constructor(@inject(TYPES.FileTypeRepository) private repository: IFileTypeRepository) { }

    async execute(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}
