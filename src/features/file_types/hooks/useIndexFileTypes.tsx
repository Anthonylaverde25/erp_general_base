import { useQuery } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IndexFileTypesUseCase } from '@/application/use_cases/file_types/IndexFileTypesUseCase';

export default function useIndexFileTypes() {
    const use_case = container.get<IndexFileTypesUseCase>(TYPES.IndexFileTypesUseCase);

    const {
        data: fileTypes,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['file-types'],
        queryFn: async () => await use_case.execute()
    });

    return { fileTypes, isLoading, isError, refetch };
}
