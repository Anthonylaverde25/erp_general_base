import { z } from 'zod';

export const employeeSchema = z.object({
	first_name: z.string().nonempty('Nombre requerido'),
	last_name: z.string().nonempty('Apellido requerido'),
	document_type: z.string().nonempty('Tipo de documento requerido'),
	document_number: z.string().nonempty('Número de documento requerido'),
	department_id: z.string().optional().nullable(),
	job_position_id: z.string().optional().nullable(),
	birth_date: z.string().optional().nullable().or(z.literal('')),
	gender: z.string().optional().nullable(),
	hire_date: z.string().nonempty('Fecha de contratación requerida'),
	termination_date: z.string().optional().nullable().or(z.literal('')),
	status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),

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
				name: z.string().optional(), // Bank Name
				account_holder: z.string().optional(),
				account_number: z.string().optional(), // IBAN
				swift: z.string().optional(),
				is_default: z.boolean().optional()
			})
		)
		.optional()
});

export type EmployeeFormType = z.infer<typeof employeeSchema>;
