import { DeleteStoreUseCase } from "@/application/use_cases/stores/DeleteStoreUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

export default function useDeleteStore() {
    const use_case = container.get<DeleteStoreUseCase>(
        TYPES.DeleteStoreUseCase,
    );
    const activeCompany = useActiveCompany();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: async (id: number) => {
            return await use_case.execute(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["stores", activeCompany?.id],
            });
            enqueueSnackbar(t("messages.deleted_successfully"), { variant: "success" });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.message || t("errors.default"), { variant: "error" });
        },
    });

    return {
        handleDeleteStore: mutateAsync,
        isLoading: isPending,
        error,
    };
}
