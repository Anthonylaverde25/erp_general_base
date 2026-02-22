import { z } from 'zod';

export const taxRateSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.'
	}),
	percentage: z.coerce.number().min(0, {
		message: 'Percentage must be a positive number.'
	}),
	tax_type_id: z.coerce.number().min(1, {
		message: 'Tax Type is required.'
	})
});

export type TaxRateFormType = z.infer<typeof taxRateSchema>;
