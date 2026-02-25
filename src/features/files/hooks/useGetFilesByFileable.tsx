import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { GetFilesByFileableUseCase } from '@/application/use_cases/files/GetFilesByFileableUseCase';

export default function useGetFilesByFileable(fileableType: string, fileableId: number) {
    const use_case = container.get<GetFilesByFileableUseCase>(TYPES.GetFilesByFileableUseCase);

    const {
        data: files,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['files', fileableType, fileableId],
        queryFn: async () => await use_case.execute(fileableType, fileableId),
        enabled: !!fileableType && !!fileableId
    });

    return { files, isLoading, isError, refetch };
}
