import { IRole } from './role.types';

/**
 * Tipado general de la entidad user
 */
export interface IUser {
	id: number | null;
	name: string;
	email: string;
	role: IRole | null;
	role_id?: number;

	// Campos adicionales del backend
	full_name?: string;
	last_name?: string;
	siglas?: string;
	phone?: string;
	address?: string;
	color?: string;
	email_verified_at?: string;
	is_active?: boolean;
	needs_password_change?: boolean;
	observations?: string;
	active_company_id?: number;
	authorized_employees?: { id: number; full_name: string }[];
}

/**
 * ICreateUser - Tipo para crear un nuevo usuario
 * SOLO usar durante registro/creación
 * Incluye password que debe ser encriptado ANTES de enviar al backend
 */
export interface ICreateUser {
	name: string;
	last_name?: string;
	email: string;
	password: string;
	password_confirmation: string;
	role_id: number;
	department_ids: number[];
	phone: string;
	department_id: number;
	job_position_id: number;
	document_type: string;
	document_number: string;
}

/**
 * IUpdateUser - Tipo para actualizar un usuario existente
 * Los campos de password son opcionales (solo si se desea cambiar la contraseña)
 */
export interface IUpdateUser {
	id: number;
	name: string;
	email: string;
	password?: string;
	password_confirmation?: string;
	role_id: number;
	department_ids: number[];
	phone: string;
}
