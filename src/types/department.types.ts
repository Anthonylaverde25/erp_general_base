export interface IDepartment {
    id: number;
    name: string;
    code: string;
    description: string | null;
    company_id: number;
    parent_id: number | null;
    manager_id: number | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;

    // Optional included relations
    manager?: any; // Will type properly later if needed
    sub_departments?: IDepartment[];
    children?: IDepartment[];
    users?: any[];
}

export interface ICreateDepartment {
    name: string;
    code: string;
    description?: string;
    company_id: number;
    parent_id?: number | null;
    manager_id?: number | null;
    is_active?: boolean;
    users?: number[]; // Array of user IDs to associate
}

export interface IUpdateDepartment {
    name?: string;
    code?: string;
    description?: string;
    company_id?: number;
    parent_id?: number | null;
    manager_id?: number | null;
    is_active?: boolean;
    users?: number[]; // Sync users
}
