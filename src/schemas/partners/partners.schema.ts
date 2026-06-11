import { z } from 'zod';

export const partnerSchema = z.object({
	name: z.string().nonempty('Requerido'),
	comercial_name: z.string().optional(),
	vat_number: z.string().optional(),
	cif: z.string().optional(),
	type: z.enum(['company', 'person', 'public_organism', 'prospect']),
	role: z.enum(['client', 'supplier', 'client_supplier', 'prospect']),
	payment_method_id: z.string().nonempty('Requerido'),
	credit_available: z.boolean().optional(),
	grouped_billing: z.boolean().optional(),
	currency_id: z.string().optional(),
	website: z.string().url('URL inválida').optional().or(z.literal('')),

	// Address fields
	address_id: z.number().optional(),
	address_street: z.string().optional(),
	address_city: z.string().optional(),
	address_state: z.string().optional(),
	address_postal_code: z.string().optional(),
	address_country: z.string().optional(),
	address_county: z.string().optional(),

	// Contact fields
	contact_id: z.number().optional(),
	contact_email: z.string().email('Email inválido').optional().or(z.literal('')),
	contact_phone: z.string().optional(),

	// Bank Accounts
	bank_accounts: z
		.array(
			z.object({
				id: z.number().optional(),
				name: z.string().optional(), // Using name for Bank Name
				account_holder: z.string().optional(),
				account_number: z.string().optional(), // IBAN
				swift: z.string().optional(),
				is_default: z.boolean().optional()
			})
		)
		.optional(),

	image: z.any().optional(),

	// Tax IDs
	sale_tax_ids: z.array(z.number()).optional(),
	purchase_tax_ids: z.array(z.number()).optional()
});

export type PartnerFormType = z.infer<typeof partnerSchema>;
