import { FileEntity } from '@/domain/entities/files/FileEntity';

export interface IFileRepository {
    getByFileable(fileableType: string, fileableId: number): Promise<FileEntity[]>;
    upload(fileableType: string, fileableId: number, file: File, fileTypeId?: number): Promise<FileEntity>;
    delete(id: number): Promise<void>;
    download(id: number): Promise<{ blob: Blob; filename: string }>;
    view(id: number): Promise<{ blob: Blob; filename: string }>;
    previewJson(id: number): Promise<{ data: any[]; total_rows: number }>;
}
