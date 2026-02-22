import { z } from 'zod';

export const unitSchema = z.object({
	unit_type_id: z.number().min(1, 'Unit Type is required'),
	code: z.string().min(1, 'Code is required'),
	name: z.string().min(1, 'Name is required')
});

export type UnitFormType = z.infer<typeof unitSchema>;
