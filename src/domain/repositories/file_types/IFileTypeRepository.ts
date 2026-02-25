import { FileTypeEntity } from '../../entities/file_types/FileTypeEntity';

export interface IFileTypeRepository {
    getAll(): Promise<FileTypeEntity[]>;
    getById(id: number): Promise<FileTypeEntity>;
    create(data: Partial<FileTypeEntity>): Promise<FileTypeEntity>;
    update(id: number, data: Partial<FileTypeEntity>): Promise<FileTypeEntity>;
    delete(id: number): Promise<void>;
}
