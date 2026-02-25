import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { CreateFileTypeUseCase } from '@/application/use_cases/file_types/CreateFileTypeUseCase';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

export function useCreateFileType() {
    const queryClient = useQueryClient();
    const use_case = container.get<CreateFileTypeUseCase>(TYPES.CreateFileTypeUseCase);

    return useMutation({
        mutationFn: (data: Partial<FileTypeEntity>) => use_case.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['file-types'] });
        }
    });
}
