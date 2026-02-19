import { z } from 'zod';

export const itemSchema = z.object({
    sku: z.string().min(3, 'Mínimo 3 caracteres').nonempty('Requerido'),
    name: z.string().nonempty('Requerido'),
    type: z.enum(['physical', 'service']),
    unit_id: z.string().min(1, 'Requerido'), // Required
    category_id: z.string().optional(), // Using string for select value
    family_id: z.string().optional(),
    subcategory_id: z.string().optional(),
    sale_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    purchase_price: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),

    // Tax IDs
    tax_rate_ids: z.array(z.number()).optional(),
    image: z.any().optional(),
});

export type ItemFormType = z.infer<typeof itemSchema>;
