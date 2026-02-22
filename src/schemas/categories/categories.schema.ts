import { z } from 'zod';

export const categorySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	parent_id: z.number().nullable().optional(),
	is_active: z.boolean().default(true)
});

export type CategoryFormType = z.infer<typeof categorySchema>;
