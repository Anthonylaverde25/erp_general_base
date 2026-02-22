import { z } from 'zod';

export const unitTypeSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional().nullable(),
	applicability: z.enum(['physical', 'service', 'both']).default('both'),
	is_active: z.boolean().default(true)
});

export type UnitTypeFormType = z.infer<typeof unitTypeSchema>;
