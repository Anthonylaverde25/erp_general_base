import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { DeleteFileUseCase } from '@/application/use_cases/files/DeleteFileUseCase';

export function useDeleteFile() {
    const queryClient = useQueryClient();
    const use_case = container.get<DeleteFileUseCase>(TYPES.DeleteFileUseCase);

    return useMutation({
        mutationFn: (id: number) => use_case.execute(id),
        onSuccess: () => {
            // Invalidate all files queries since we don't know the exact fileable tuple
            // in delete context unless we pass it, but this is safer.
            queryClient.invalidateQueries({ queryKey: ['files'] });
        }
    });
}
