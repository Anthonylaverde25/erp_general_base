import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { DeleteFileTypeUseCase } from '@/application/use_cases/file_types/DeleteFileTypeUseCase';

export function useDeleteFileType() {
    const queryClient = useQueryClient();
    const use_case = container.get<DeleteFileTypeUseCase>(TYPES.DeleteFileTypeUseCase);

    return useMutation({
        mutationFn: (id: number) => use_case.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['file-types'] });
        }
    });
}
