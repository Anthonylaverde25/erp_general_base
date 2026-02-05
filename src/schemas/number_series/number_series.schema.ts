import { z } from "zod";

export const createNumberSeriesSchema = z.object({
    document_type_id: z.number({
        required_error: "El tipo de documento es requerido",
        invalid_type_error: "El tipo de documento es requerido",
    }).min(1, "El tipo de documento es requerido"),
    serie: z.string().min(1, "La serie es requerida").max(10, "La serie no puede tener más de 10 caracteres"),
    year: z.number().int().min(2000, "El año debe ser válido").max(new Date().getFullYear() + 1, "El año no puede ser futuro"),

    terms: z.string().optional(),
});

export type CreateNumberSeriesFormType = z.infer<typeof createNumberSeriesSchema>;

export const defaultCreateNumberSeriesValues: CreateNumberSeriesFormType = {
    document_type_id: 0,
    serie: "",
    year: new Date().getFullYear(),
    terms: "",
};
