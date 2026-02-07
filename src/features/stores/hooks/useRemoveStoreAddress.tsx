import { RemoveAddressUseCase } from "@/application/use_cases/stores/RemoveAddressUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

export default function useRemoveStoreAddress() {
    const use_case = container.get<RemoveAddressUseCase>(
        TYPES.RemoveAddressUseCase,
    );
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: async ({
            storeId,
            addressId,
        }: {
            storeId: number;
            addressId: number;
        }) => {
            return await use_case.execute({
                storeId,
                addressId,
            });
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["stores", variables.storeId],
            });
            // also invalidate list if needed, but specific store is most important
            queryClient.invalidateQueries({
                queryKey: ["stores"],
            });
            enqueueSnackbar(t("messages.deleted_successfully"), { variant: "success" });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.message || t("errors.default"), { variant: "error" });
        },
    });

    return {
        handleRemoveAddress: mutateAsync,
        isRemoving: isPending,
        error,
    };
}
