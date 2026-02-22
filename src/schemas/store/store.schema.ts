import { z } from 'zod';

// Schema para dirección
const addressSchema = z.object({
	street: z.string().min(1, 'La calle es requerida'),
	street_2: z.string().optional().nullable(),
	city: z.string().min(1, 'La ciudad es requerida'),
	state: z.string().min(1, 'El estado/provincia es requerido'),
	postal_code: z.string().min(1, 'El código postal es requerido'),
	country: z.string().min(1, 'El país es requerido'),
	default: z.boolean().optional().default(false)
});

const emptyStringToUndefined = (val: unknown) => {
	if (typeof val === 'object' && val !== null) {
		const { street, city, state, postal_code, country } = val as any;

		// Check if main fields are empty
		if (!street && !city && !state && !postal_code && !country) {
			return undefined;
		}
	}

	return val;
};

const baseStoreSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	code: z.string().optional(),
	is_active: z.boolean().optional().default(true),
	address: z.preprocess(emptyStringToUndefined, addressSchema.optional())
});

export const createStoreSchema = baseStoreSchema;

export const updateStoreSchema = baseStoreSchema.partial();

export type CreateStoreFormType = z.infer<typeof createStoreSchema>;
export type UpdateStoreFormType = z.infer<typeof updateStoreSchema>;
