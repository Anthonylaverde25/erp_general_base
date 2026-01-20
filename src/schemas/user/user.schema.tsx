import { z } from 'zod';

export const createUserSchema = z
	.object({
		name: z.string().min(1, 'El nombre es requerido'),
		email: z.string().email('Debe ingresar un email válido').min(1, 'El email es requerido'),
		password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
		password_confirmation: z.string().min(1, 'Debe confirmar la contraseña'),
		role_id: z.number({ required_error: 'Debe seleccionar un rol' }),
		phone: z.string().optional()
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Las contraseñas no coinciden',
		path: ['password_confirmation']
	});

export type CreateUserFormType = z.infer<typeof createUserSchema>;

export const defaultCreateUserValues: CreateUserFormType = {
	name: '',
	email: '',
	password: '',
	password_confirmation: '',
	role_id: 0, // 0 as empty/placeholder, managed by form
	phone: ''
};
