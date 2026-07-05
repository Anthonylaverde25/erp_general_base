export interface RoleListDTO {
	id: number;
	name: string;
	code: string;
	description: string;
	active: boolean;
	permissions?: any[];
	created_at?: string;
	updated_at?: string;
}
