import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UpdateFileTypeUseCase } from '@/application/use_cases/file_types/UpdateFileTypeUseCase';
import { FileTypeEntity } from '@/domain/entities/file_types/FileTypeEntity';

export function useUpdateFileType() {
    const queryClient = useQueryClient();
    const use_case = container.get<UpdateFileTypeUseCase>(TYPES.UpdateFileTypeUseCase);

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<FileTypeEntity> }) => use_case.execute(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['file-types'] });
        }
    });
}
