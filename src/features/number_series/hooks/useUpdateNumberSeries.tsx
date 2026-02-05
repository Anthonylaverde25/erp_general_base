import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "@/di/container";
import { UpdateNumberSeriesUseCase } from "@/application/use_cases/number_series/UpdateNumberSeriesUseCase";
import { UpdateNumberSeriesFormType } from "@/schemas/number_series/number_series.schema";
import { toast } from "sonner";
import { TYPES } from "@/di/types";

export default function useUpdateNumberSeries() {
    const queryClient = useQueryClient();
    const updateNumberSeriesUseCase = container.get<UpdateNumberSeriesUseCase>(
        TYPES.UpdateNumberSeriesUseCase
    );

    const {
        mutateAsync: handleUpdateNumberSeries,
        isPending: isLoading,
    } = useMutation({
        mutationFn: async ({ id, ...data }: UpdateNumberSeriesFormType & { id: number }) => {
            return await updateNumberSeriesUseCase.execute(id, data);
        },
        onSuccess: ({ message }) => {
            toast.success(message || "Serie actualizada exitosamente");
            queryClient.invalidateQueries({ queryKey: ["number-series"] });
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Error al actualizar la serie";
            toast.error(message);
        },
    });

    return { handleUpdateNumberSeries, isLoading };
}
