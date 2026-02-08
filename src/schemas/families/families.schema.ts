import { z } from "zod";

export const familySchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    tax_rate_ids: z.array(z.coerce.number()).min(1, {
        message: "At least one Tax Rate is required.",
    }),
    percentage: z.coerce.number().min(0, {
        message: "Percentage must be positive.",
    }),
});

export type FamilyFormType = z.infer<typeof familySchema>;
