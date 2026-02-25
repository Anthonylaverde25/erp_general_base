import { useMutation } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { ViewFileUseCase } from '@/application/use_cases/files/ViewFileUseCase';

export function useViewFile() {
    const use_case = container.get<ViewFileUseCase>(TYPES.ViewFileUseCase);

    return useMutation({
        mutationFn: (id: number) => use_case.execute(id),
        onSuccess: ({ blob }) => {
            // Create object URL from the blob ensuring to retain its type.
            const url = window.URL.createObjectURL(new Blob([blob], { type: blob.type }));
            const newWindow = window.open(url, '_blank');
            if (newWindow) {
                // Free memory when the window is loaded or close is attempted.
                // Depending on the browser, a short timeout is enough.
                setTimeout(() => window.URL.revokeObjectURL(url), 10000);
            } else {
                alert('Por favor permite ventanas emergentes para ver el archivo.');
            }
        }
    });
}
