import { CreateNumberSeriesUseCase } from "@/application/use_cases/number_series/CreateNumberSeriesUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { CreateNumberSeriesDTO } from "@/domain/entities/number_series/DTOs/CreateNumberSeriesDTO";
import { CreateNumberSeriesFormType } from "@/schemas/number_series/number_series.schema";

export default function useCreateNumberSeries() {
    const use_case = container.get<CreateNumberSeriesUseCase>(
        TYPES.CreateNumberSeriesUseCase,
    );
    const activeCompany = useActiveCompany();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: async (data: CreateNumberSeriesFormType) => {
            if (!activeCompany) throw new Error("No active company");
            return await use_case.execute({
                ...data,
                current_number: 0,
            } as CreateNumberSeriesDTO);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["number_series", activeCompany?.id],
            });
            enqueueSnackbar(response.message, { variant: "success" });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.message || t("errors.default"), { variant: "error" });
        },
    });

    return {
        handleCreateNumberSeries: mutateAsync,
        isLoading: isPending,
        error,
    };
}
