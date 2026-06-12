import { z } from 'zod';

export const createUserSchema = z
	.object({
		name: z.string().min(1, 'El nombre es requerido'),
		last_name: z.string().optional(),
		email: z.string().email('Debe ingresar un email válido').min(1, 'El email es requerido'),
		password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
		password_confirmation: z.string().min(1, 'Debe confirmar la contraseña'),
		role_id: z.number({ required_error: 'Debe seleccionar un rol' }).min(1, 'Debe seleccionar un rol'),
		phone: z.string().optional(),
		department_id: z
			.number({ required_error: 'El departamento es requerido' })
			.min(1, 'El departamento es requerido'),
		job_position_id: z
			.number({ required_error: 'El puesto de trabajo es requerido' })
			.min(1, 'El puesto de trabajo es requerido'),
		document_type: z.string().min(1, 'El tipo de documento es requerido'),
		document_number: z.string().min(1, 'El número de documento es requerido')
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Las contraseñas no coinciden',
		path: ['password_confirmation']
	});

export type CreateUserFormType = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
	.object({
		id: z.number(),
		name: z.string().min(1, 'El nombre es requerido'),
		email: z.string().email('Debe ingresar un email válido').min(1, 'El email es requerido'),
		password: z.string().optional(),
		password_confirmation: z.string().optional(),
		role_id: z.number({ required_error: 'Debe seleccionar un rol' }).min(1, 'Debe seleccionar un rol'),
		phone: z.string().optional()
	})
	.refine(
		(data) => {
			// Si se proporciona una contraseña, debe tener al menos 8 caracteres
			if (data.password && data.password.length > 0 && data.password.length < 8) {
				return false;
			}

			return true;
		},
		{
			message: 'La contraseña debe tener al menos 8 caracteres',
			path: ['password']
		}
	)
	.refine(
		(data) => {
			// Si se proporciona una contraseña, debe confirmarse
			if (data.password && data.password.length > 0) {
				return data.password === data.password_confirmation;
			}

			return true;
		},
		{
			message: 'Las contraseñas no coinciden',
			path: ['password_confirmation']
		}
	);

export type UpdateUserFormType = z.infer<typeof updateUserSchema>;
