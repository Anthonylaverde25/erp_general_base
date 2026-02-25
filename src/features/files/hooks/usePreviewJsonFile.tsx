import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { PreviewJsonFileUseCase } from '@/application/use_cases/files/PreviewJsonFileUseCase';

export function usePreviewJsonFile(fileId: number, enabled: boolean = false) {
    const use_case = container.get<PreviewJsonFileUseCase>(TYPES.PreviewJsonFileUseCase);

    return useQuery({
        queryKey: ['filePreviewJson', fileId],
        queryFn: () => use_case.execute(fileId),
        enabled: enabled && fileId > 0,
        staleTime: 5 * 60 * 1000,
    });
}
