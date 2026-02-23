import { ICreateDepartment, IUpdateDepartment, IDepartment } from '@/types/department.types';

export class DepartmentEntity implements IDepartment {
    constructor(
        public id: number,
        public name: string,
        public code: string,
        public description: string | null,
        public company_id: number,
        public parent_id: number | null,
        public manager_id: number | null,
        public is_active: boolean,
        public created_at?: string,
        public updated_at?: string,
        public manager?: any,
        public sub_departments?: IDepartment[],
        public children?: IDepartment[], // Added this line
        public users?: any[],
    ) { }

    static fromPrimitives(data: IDepartment): DepartmentEntity {
        const entity = new DepartmentEntity(
            data.id,
            data.name,
            data.code,
            data.description ?? null,
            data.company_id,
            data.parent_id ?? null,
            data.manager_id ?? null,
            data.is_active,
            data.created_at,
            data.updated_at
        );

        entity.manager = data.manager;
        entity.children = data.children;
        entity.sub_departments = data.children; // Fallback mapping
        entity.users = data.users;

        return entity;
    }

    static create(data: ICreateDepartment & { id?: number }): DepartmentEntity {
        return new DepartmentEntity(
            data.id || 0,
            data.name,
            data.code,
            data.description || null,
            data.company_id,
            data.parent_id || null,
            data.manager_id || null,
            data.is_active ?? true
        );
    }

    toPlainObject(): any {
        return {
            id: this.id,
            name: this.name,
            code: this.code,
            description: this.description,
            company_id: this.company_id,
            parent_id: this.parent_id,
            manager_id: this.manager_id,
            is_active: this.is_active,
            created_at: this.created_at,
            updated_at: this.updated_at,
            manager: this.manager,
            sub_departments: this.sub_departments,
            users: this.users
        };
    }
}
