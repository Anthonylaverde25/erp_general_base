import { UpdateStoreUseCase } from "@/application/use_cases/stores/UpdateStoreUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { UpdateStoreFormType } from "@/schemas/store/store.schema";

export default function useUpdateStore() {
    const use_case = container.get<UpdateStoreUseCase>(
        TYPES.UpdateStoreUseCase,
    );
    const activeCompany = useActiveCompany();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: UpdateStoreFormType;
        }) => {
            return await use_case.execute({
                id,
                data,
            });
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: ["stores", activeCompany?.id],
            });
            enqueueSnackbar(response.message, { variant: "success" });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.message || t("errors.default"), { variant: "error" });
        },
    });

    return {
        handleUpdateStore: mutateAsync,
        isLoading: isPending,
        error,
    };
}
