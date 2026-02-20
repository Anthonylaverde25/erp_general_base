import { z } from 'zod';

const baseItemSchema = z.object({
	sku: z.string().min(3, 'Mínimo 3 caracteres'),
	name: z.string().min(1, 'Requerido'),
	unit_id: z.string().min(1, 'Requerido'),
	category_id: z.string().optional(),
	family_id: z.string().optional(),
	subcategory_id: z.string().optional(),
	sale_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
	purchase_price: z.number().min(0).optional(),
	profit_margin: z.number().optional(),
	description: z.string().optional(),
	is_active: z.boolean().optional(),
	tax_rate_ids: z.array(z.number()).optional(),
	image: z.any().optional(),
	store_id: z.string().nullable().optional(),
	partner_id: z.string().nullable().optional(),
	barcode: z.string().optional(),
	is_inventoriable: z.boolean().optional(),
	initial_stock: z.number().min(0).optional(),
	quantity: z.number().min(0).optional()
});

const physicalItemSchema = baseItemSchema.extend({
	type: z.literal('physical'),
	// Campos exclusivos de físico — ahora tipados correctamente
	weight: z.number().min(0, 'El peso debe ser mayor o igual a 0').optional(),
	dimension_length: z.number().min(0).optional(),
	dimension_width: z.number().min(0).optional(),
	dimension_height: z.number().min(0).optional(),
	dimension_unit: z.string().optional(),
	is_inventoriable: z.boolean().optional()
	// Estos campos NO existen en físico
});

const serviceItemSchema = baseItemSchema.extend({
	type: z.literal('service'),
	estimated_time: z.number().int('Debe ser un número entero').min(0, 'Debe ser mayor o igual a 0').optional(),
	req_scheduling: z.boolean().optional(),
	barcode: z.undefined().optional(),
	is_inventoriable: z.undefined().optional(),
	store_id: z.undefined().optional(),
	initial_stock: z.undefined().optional(),
	quantity: z.undefined().optional(),
	// Dimensiones solo aplican a físicos
	dimension_length: z.undefined().optional(),
	dimension_width: z.undefined().optional(),
	dimension_height: z.undefined().optional(),
	dimension_unit: z.undefined().optional(),
	weight: z.undefined().optional()
});

export const itemSchema = z.discriminatedUnion('type', [physicalItemSchema, serviceItemSchema]);

export type ItemFormType = z.infer<typeof itemSchema>;
// TypeScript ahora sabe exactamente qué campos tiene cada tipo:
// ItemFormType = PhysicalItem | ServiceItem
