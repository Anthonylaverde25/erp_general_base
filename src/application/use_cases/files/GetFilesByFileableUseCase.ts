import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IFileRepository } from '@/domain/repositories/files/IFileRepository';
import { FileEntity } from '@/domain/entities/files/FileEntity';

@injectable()
export class GetFilesByFileableUseCase {
    constructor(@inject(TYPES.FileRepository) private repository: IFileRepository) { }

    async execute(fileableType: string, fileableId: number): Promise<FileEntity[]> {
        return this.repository.getByFileable(fileableType, fileableId);
    }
}
