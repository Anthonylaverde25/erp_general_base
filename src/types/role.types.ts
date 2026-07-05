/**
 * Role Entity Types
 */
export interface IRole {
	id: number;
	name: string;
	code: string;
	description: string;
	active: boolean;
	permissions?: number[];
	created_at?: string;
	updated_at?: string;
}

/**
 * ICreateRole - Type for creating a new role
 */
export interface ICreateRole {
	name: string;
	code: string;
	description: string;
	active: boolean;
	permissions?: number[];
}

/**
 * IUpdateRole - Type for updating an existing role
 */
export interface IUpdateRole {
	id: number;
	name: string;
	code: string;
	description: string;
	active: boolean;
	permissions?: number[];
}
