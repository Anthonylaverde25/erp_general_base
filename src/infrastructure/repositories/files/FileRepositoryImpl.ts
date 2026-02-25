import { injectable } from 'inversify';
import { IFileRepository } from '@/domain/repositories/files/IFileRepository';
import { FileEntity } from '@/domain/entities/files/FileEntity';
import axiosInstance from '@/lib/@axios';

@injectable()
export class FileRepositoryImpl implements IFileRepository {
    private readonly endpoint = '/files';

    async getByFileable(fileableType: string, fileableId: number): Promise<FileEntity[]> {
        const response = await axiosInstance.get(`${this.endpoint}/${fileableType}/${fileableId}`);
        return response.data.map((item: any) => FileEntity.fromPrimitives(item));
    }

    async upload(fileableType: string, fileableId: number, file: File, fileTypeId?: number): Promise<FileEntity> {
        const formData = new FormData();
        formData.append('file', file);
        if (fileTypeId) {
            formData.append('file_type_id', fileTypeId.toString());
        }

        const response = await axiosInstance.post(`${this.endpoint}/${fileableType}/${fileableId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return FileEntity.fromPrimitives(response.data);
    }

    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`${this.endpoint}/${id}`);
    }

    async download(id: number): Promise<{ blob: Blob; filename: string }> {
        const response = await axiosInstance.get(`${this.endpoint}/${id}/download`, {
            responseType: 'blob'
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'download';
        if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    }

    async view(id: number): Promise<{ blob: Blob; filename: string }> {
        const response = await axiosInstance.get(`${this.endpoint}/${id}/view`, {
            responseType: 'blob'
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'document';
        if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    }

    async previewJson(id: number): Promise<{ data: any[]; total_rows: number }> {
        const response = await axiosInstance.get(`${this.endpoint}/${id}/preview-json`);
        return response.data;
    }
}
