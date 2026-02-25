import { useMutation } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { DownloadFileUseCase } from '@/application/use_cases/files/DownloadFileUseCase';

export function useDownloadFile() {
    const use_case = container.get<DownloadFileUseCase>(TYPES.DownloadFileUseCase);

    return useMutation({
        mutationFn: (id: number) => use_case.execute(id),
        onSuccess: ({ blob, filename }) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        }
    });
}
