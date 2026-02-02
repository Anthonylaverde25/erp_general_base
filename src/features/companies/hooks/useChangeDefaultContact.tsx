import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { ChangeDefaultContactUseCase } from "@/application/use_cases/company/ChangeDefaultContactUseCase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Contact } from "@/types/company.types";

export const useChangeDefaultContact = () => {
    const useCase = container.get<ChangeDefaultContactUseCase>(TYPES.ChangeDefaultContactUseCase);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (contactId: Contact['id']) => await useCase.execute(contactId),
        onSuccess: ({ message }) => {
            queryClient.invalidateQueries({ queryKey: ['company'] });
            toast.success(message, {
                description: `El contacto predeterminado fue cambiado exitosamente.`,
            });
        },
        onError: (error) => {
            console.error('Error al cambiar el contacto predeterminado:', error);
        },
    });

    const handleChangeDefaultContact = (contactId: Contact['id']) => {
        return mutation.mutateAsync(contactId);
    }

    return {
        ...mutation,
        handleChangeDefaultContact,
    };
};
