/**
 * Role Entity Types
 */
export interface RoleType {
  id: number;
  name: string;
  code: string;
  description: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type Role = RoleType;

/**
 * CreateRoleType - Type for creating a new role
 */
export interface CreateRoleType {
  name: string;
  code: string;
  description: string;
  active: boolean;
}

/**
 * UpdateRoleType - Type for updating an existing role
 */
export interface UpdateRoleType {
  id: number;
  name: string;
  code: string;
  description: string;
  active: boolean;
}
