import { CreateFileTypeFormType, UpdateFileTypeFormType } from './file_types.schema';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

export const defaultCreateFileTypeValues: CreateFileTypeFormType = {
    name: '',
    description: '',
    is_active: true
};

export const defaultUpdateFileTypeValues = (fileType: FileTypeEntity | null): UpdateFileTypeFormType => {
    if (!fileType) return defaultCreateFileTypeValues;

    return {
        name: fileType.name,
        description: fileType.description || '',
        is_active: fileType.is_active
    };
};
