import { z } from "zod";

export const createBankAccountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  account_holder: z.string().min(1, "El titular de la cuenta es requerido"),
  account_number: z
    .string()
    .min(1, "El número de cuenta es requerido")
    .max(50, "El número de cuenta no puede exceder 50 caracteres"),
  swift: z
    .string()
    .min(1, "El código SWIFT es requerido")
    .max(11, "El código SWIFT no puede exceder 11 caracteres"),
});

export type CreateBankAccountFormType = z.infer<typeof createBankAccountSchema>;

export const defaultCreateBankAccountValues: CreateBankAccountFormType = {
  name: "",
  account_holder: "",
  account_number: "",
  swift: "",
};

export const updateBankAccountSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "El nombre es requerido"),
  account_holder: z.string().min(1, "El titular de la cuenta es requerido"),
  account_number: z
    .string()
    .min(1, "El número de cuenta es requerido")
    .max(50, "El número de cuenta no puede exceder 50 caracteres"),
  swift: z
    .string()
    .min(1, "El código SWIFT es requerido")
    .max(11, "El código SWIFT no puede exceder 11 caracteres"),
});

export type UpdateBankAccountFormType = z.infer<typeof updateBankAccountSchema>;

export const defaultUpdateBankAccountValues = (
  bankAccount?: any,
): UpdateBankAccountFormType => ({
  id: bankAccount?.id || 0,
  name: bankAccount?.name || "",
  account_holder: bankAccount?.account_holder || "",
  account_number: bankAccount?.account_number || "",
  swift: bankAccount?.swift || "",
});
