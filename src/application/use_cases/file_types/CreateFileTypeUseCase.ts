import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFileTypeRepository } from '@/domain/repositories/file_types/IFileTypeRepository';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

@injectable()
export class CreateFileTypeUseCase {
    constructor(@inject(TYPES.FileTypeRepository) private repository: IFileTypeRepository) { }

    async execute(data: Partial<FileTypeEntity>): Promise<FileTypeEntity> {
        return this.repository.create(data);
    }
}
