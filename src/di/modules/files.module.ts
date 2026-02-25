import { Container } from 'inversify';
import { TYPES } from '../types';
import type { IFileRepository } from '@/domain/repositories/files/IFileRepository';
import { FileRepositoryImpl } from '@/infrastructure/repositories/files/FileRepositoryImpl';
import { GetFilesByFileableUseCase } from '@/application/use_cases/files/GetFilesByFileableUseCase';
import { UploadFileUseCase } from '@/application/use_cases/files/UploadFileUseCase';
import { DeleteFileUseCase } from '@/application/use_cases/files/DeleteFileUseCase';
import { DownloadFileUseCase } from '@/application/use_cases/files/DownloadFileUseCase';
import { ViewFileUseCase } from '@/application/use_cases/files/ViewFileUseCase';
import { PreviewJsonFileUseCase } from '@/application/use_cases/files/PreviewJsonFileUseCase';

export const registerFilesModule = (container: Container) => {
    container.bind<IFileRepository>(TYPES.FileRepository).to(FileRepositoryImpl).inSingletonScope();

    container.bind<GetFilesByFileableUseCase>(TYPES.GetFilesByFileableUseCase).to(GetFilesByFileableUseCase);
    container.bind<UploadFileUseCase>(TYPES.UploadFileUseCase).to(UploadFileUseCase);
    container.bind<DeleteFileUseCase>(TYPES.DeleteFileUseCase).to(DeleteFileUseCase);
    container.bind<DownloadFileUseCase>(TYPES.DownloadFileUseCase).to(DownloadFileUseCase);
    container.bind<ViewFileUseCase>(TYPES.ViewFileUseCase).to(ViewFileUseCase);
    container.bind<PreviewJsonFileUseCase>(TYPES.PreviewJsonFileUseCase).to(PreviewJsonFileUseCase);
};
