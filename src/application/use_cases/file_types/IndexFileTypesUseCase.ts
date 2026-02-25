import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFileTypeRepository } from '@/domain/repositories/file_types/IFileTypeRepository';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

@injectable()
export class IndexFileTypesUseCase {
    constructor(@inject(TYPES.FileTypeRepository) private repository: IFileTypeRepository) { }

    async execute(): Promise<FileTypeEntity[]> {
        return this.repository.getAll();
    }
}
