import { Container } from 'inversify';
import { TYPES } from '../types';
import { IFileTypeRepository } from '@/domain/repositories/file_types/IFileTypeRepository';
import { FileTypeRepositoryImpl } from '@/infrastructure/repositories/file_types/FileTypeRepositoryImpl';
import { IndexFileTypesUseCase } from '@/application/use_cases/file_types/IndexFileTypesUseCase';
import { CreateFileTypeUseCase } from '@/application/use_cases/file_types/CreateFileTypeUseCase';
import { UpdateFileTypeUseCase } from '@/application/use_cases/file_types/UpdateFileTypeUseCase';
import { DeleteFileTypeUseCase } from '@/application/use_cases/file_types/DeleteFileTypeUseCase';

export const registerFileTypesModule = (container: Container) => {
    container.bind<IFileTypeRepository>(TYPES.FileTypeRepository).to(FileTypeRepositoryImpl).inSingletonScope();

    container.bind<IndexFileTypesUseCase>(TYPES.IndexFileTypesUseCase).to(IndexFileTypesUseCase);
    container.bind<CreateFileTypeUseCase>(TYPES.CreateFileTypeUseCase).to(CreateFileTypeUseCase);
    container.bind<UpdateFileTypeUseCase>(TYPES.UpdateFileTypeUseCase).to(UpdateFileTypeUseCase);
    container.bind<DeleteFileTypeUseCase>(TYPES.DeleteFileTypeUseCase).to(DeleteFileTypeUseCase);
};
