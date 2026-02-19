import { z } from "zod";

export const unitTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
});

export type UnitTypeFormType = z.infer<typeof unitTypeSchema>;
