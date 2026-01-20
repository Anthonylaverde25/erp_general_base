/**
 * Role Entity Types
 */
export interface Role {
	id: number;
	name: string;
	code: string;
	description: string;
	status: boolean;
	created_at?: string;
	updated_at?: string;
}

/**
 * CreateRoleType - Type for creating a new role
 */
export interface CreateRoleType {
	name: string;
	code: string;
	description: string;
	status: boolean;
}

/**
 * UpdateRoleType - Type for updating an existing role
 */
export interface UpdateRoleType {
	id: number;
	name: string;
	code: string;
	description: string;
	status: boolean;
}
