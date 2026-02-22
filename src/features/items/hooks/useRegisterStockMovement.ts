import { useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { RegisterStockMovementUseCase } from '@/application/use_cases/items/RegisterStockMovementUseCase';
import { RegisterStockMovementDTO } from '@/domain/entities/items/repositories/item.action.repository';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useRegisterStockMovement = () => {
    const queryClient = useQueryClient();
    const useCase = container.get<RegisterStockMovementUseCase>(TYPES.RegisterStockMovementUseCase);

    const { mutateAsync: handleRegisterStockMovement, isPending: isLoading } = useMutation({
        mutationFn: (data: RegisterStockMovementDTO) => useCase.execute(data),
        onSuccess: ({ message }, variables) => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['items', variables.item_id] });
            toast.success(message);
        },
        onError: (error: unknown) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(axiosError.response?.data?.message || 'Error al registrar movimiento de stock');
            console.error(error);
        }
    });

    return {
        handleRegisterStockMovement,
        isLoading
    };
};
