import { z } from 'zod';

export const createRoleSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	code: z.string().min(1, 'El código es requerido').max(50, 'El código no puede exceder 50 caracteres'),
	description: z.string().min(1, 'La descripción es requerida'),
	active: z.boolean().default(true)
});

export type CreateRoleFormType = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
	id: z.number(),
	name: z.string().min(1, 'El nombre es requerido'),
	code: z.string().min(1, 'El código es requerido').max(50, 'El código no puede exceder 50 caracteres'),
	description: z.string().min(1, 'La descripción es requerida'),
	active: z.boolean()
});

export type UpdateRoleFormType = z.infer<typeof updateRoleSchema>;
