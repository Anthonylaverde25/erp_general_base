import { CreateStoreUseCase } from "@/application/use_cases/stores/CreateStoreUseCase";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useActiveCompany from "@/features/companies/useActiveCompany";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { CreateStoreFormType } from "@/schemas/store/store.schema";
import { CreateStoreDTO } from "@/domain/entities/stores/DTOs/CreateStoreDTO";

export default function useCreateStore() {
    const use_case = container.get<CreateStoreUseCase>(
        TYPES.CreateStoreUseCase,
    );
    const activeCompany = useActiveCompany();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: async (data: CreateStoreFormType) => {
            if (!activeCompany) throw new Error("No active company");
            return await use_case.execute({
                ...data,
            } as CreateStoreDTO);
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
        handleCreateStore: mutateAsync,
        isLoading: isPending,
        error,
    };
}
