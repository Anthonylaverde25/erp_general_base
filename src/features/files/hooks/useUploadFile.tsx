import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { UploadFileUseCase } from '@/application/use_cases/files/UploadFileUseCase';

interface UploadFileParams {
    fileableType: string;
    fileableId: number;
    file: File;
    fileTypeId?: number;
}

export function useUploadFile() {
    const queryClient = useQueryClient();
    const use_case = container.get<UploadFileUseCase>(TYPES.UploadFileUseCase);

    return useMutation({
        mutationFn: ({ fileableType, fileableId, file, fileTypeId }: UploadFileParams) =>
            use_case.execute(fileableType, fileableId, file, fileTypeId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['files', variables.fileableType, variables.fileableId]
            });
        }
    });
}
