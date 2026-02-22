import { z } from 'zod';

export const createPaymentMethodSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre no puede exceder 255 caracteres'),
	type: z.string().min(1, 'El tipo es requerido').max(50, 'El tipo no puede exceder 50 caracteres'),
	description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
	details: z.any().optional(),
	is_active: z.boolean().default(true)
});

export type CreatePaymentMethodFormType = z.infer<typeof createPaymentMethodSchema>;

export const updatePaymentMethodSchema = z.object({
	id: z.number(),
	name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre no puede exceder 255 caracteres'),
	type: z.string().min(1, 'El tipo es requerido').max(50, 'El tipo no puede exceder 50 caracteres'),
	description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
	details: z.any().optional(),
	is_active: z.boolean().default(true)
});

export type UpdatePaymentMethodFormType = z.infer<typeof updatePaymentMethodSchema>;
