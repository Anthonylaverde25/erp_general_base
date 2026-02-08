import { z } from "zod";

export const createTaxTypeSchema = z.object({
    code: z.string().min(1, "El código es requerido").max(50, "El código no puede tener más de 50 caracteres"),
    name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede tener más de 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(255, "La descripción no puede tener más de 255 caracteres"),
    operation: z.enum(["add", "subtract"], {
        message: "Operación inválida",
        required_error: "La operación es requerida",
    }),
    is_active: z.boolean().default(true),
});



export type CreateTaxTypeFormType = z.infer<typeof createTaxTypeSchema>;

export const updateTaxTypeSchema = z.object({
    code: z.string().min(1, "El código es requerido").max(50, "El código no puede tener más de 50 caracteres"),
    name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede tener más de 100 caracteres"),
    description: z.string().min(1, "La descripción es requerida").max(255, "La descripción no puede tener más de 255 caracteres"),
    operation: z.enum(["add", "subtract"], {
        message: "Operación inválida",
        required_error: "La operación es requerida",
    }),
    is_active: z.boolean(),
});

export type UpdateTaxTypeFormType = z.infer<typeof updateTaxTypeSchema>;
