import { Role } from "./role.types";


/**
 * Tipado general de la entidad user
 */
export interface UserType {
    id: number | null;
    name: string;
    email: string;
    role: Role | null;
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
}


/**
 * CreateUserType - Tipo para crear un nuevo usuario
 * SOLO usar durante registro/creación
 * Incluye password que debe ser encriptado ANTES de enviar al backend
 */
export interface CreateUserType {

    name: string
    email: string
    password: string
    password_confirmation: string
    role_id: number,
    department_ids: number[]
    phone: string
}