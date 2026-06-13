import { z } from 'zod';

/**
 * Zod validation schema for creating a dispatch route.
 */
export const createRouteSchema = z.object({
	employee_id: z.coerce
		.number({ required_error: 'Debe seleccionar un empleado asignado' })
		.positive('Debe seleccionar un empleado válido'),
	notes: z.string().max(1000, 'Las notas no pueden superar los 1000 caracteres').optional().nullable(),
	document_ids: z
		.array(z.coerce.number().positive())
		.min(1, 'Debe seleccionar al menos un albarán para crear la ruta')
});

export type CreateRouteFormType = z.infer<typeof createRouteSchema>;
