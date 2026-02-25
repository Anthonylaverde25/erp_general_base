import { injectable } from 'inversify';
import { IFileTypeRepository } from '@/domain/repositories/file_types/IFileTypeRepository';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';
import axiosInstance from '@/lib/@axios';

@injectable()
export class FileTypeRepositoryImpl implements IFileTypeRepository {
    private readonly endpoint = '/file-types';

    async getAll(): Promise<FileTypeEntity[]> {
        const response = await axiosInstance.get(this.endpoint);
        return response.data.map((item: any) => FileTypeEntity.fromPrimitives(item));
    }

    async getById(id: number): Promise<FileTypeEntity> {
        const response = await axiosInstance.get(`${this.endpoint}/${id}`);
        return FileTypeEntity.fromPrimitives(response.data);
    }

    async create(data: Partial<FileTypeEntity>): Promise<FileTypeEntity> {
        const response = await axiosInstance.post(this.endpoint, data);
        return FileTypeEntity.fromPrimitives(response.data);
    }

    async update(id: number, data: Partial<FileTypeEntity>): Promise<FileTypeEntity> {
        const response = await axiosInstance.put(`${this.endpoint}/${id}`, data);
        return FileTypeEntity.fromPrimitives(response.data);
    }

    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`${this.endpoint}/${id}`);
    }
}
