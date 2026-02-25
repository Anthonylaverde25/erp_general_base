import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFileRepository } from '@/domain/repositories/files/IFileRepository';
import { FileEntity } from '@/domain/entities/files/FileEntity';

@injectable()
export class UploadFileUseCase {
    constructor(@inject(TYPES.FileRepository) private repository: IFileRepository) { }

    async execute(fileableType: string, fileableId: number, file: File, fileTypeId?: number): Promise<FileEntity> {
        return this.repository.upload(fileableType, fileableId, file, fileTypeId);
    }
}
