import { z } from "zod";

export const documentLineTaxSchema = z.object({
    id: z.number(),
    name: z.string(),
    rate: z.number(),
});

export const documentLineSchema = z.object({
    id: z.string(),
    item_id: z.number().optional(),
    code: z.string().optional().default(""),
    description: z.string().optional().default(""),
    quantity: z.string().default("1"),
    unitPrice: z.string().default("0"),
    discount: z.string().default("0"),
    taxes: z.array(documentLineTaxSchema).default([]),
    subtotal: z.string().optional().default("0.00"),
    source_document_id: z.string().optional(),
    source_document_number: z.string().optional(),
});

export const documentSchema = z.object({
    partner_id: z.union([z.string(), z.number()]).refine((val) => val !== "", {
        message: "El socio es obligatorio",
    }),
    document_type_code: z.string().optional(),
    number_series_id: z.union([z.string(), z.number()]).optional(),
    issue_date: z.string().min(1, "La fecha de emisión es obligatoria"),
    due_date: z.string().optional(),
    number: z.string().optional(),
    currency: z.string().min(1, "La divisa es obligatoria"),
    notes: z.string().optional(),
    tag: z.string().optional(),
    include_legal: z.boolean().optional().default(false),
    apply_retention: z.boolean().optional().default(true),
    auto_send: z.boolean().optional().default(false),
    item_type: z.enum(["product", "service"]),
    lines: z.array(documentLineSchema).min(1, "Debe haber al menos una línea"),
});

export type DocumentLineTax = z.infer<typeof documentLineTaxSchema>;
export type DocumentFormValues = z.infer<typeof documentSchema>;
