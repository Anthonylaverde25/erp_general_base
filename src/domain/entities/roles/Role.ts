import { ICreateRole, IUpdateRole, IRole } from '@/types/role.types';

export class RoleEntity implements IRole {
	constructor(
		public id: number,
		public name: string,
		public code: string,
		public description: string,
		public active: boolean,
		public created_at?: string,
		public updated_at?: string,
		public permissions?: number[]
	) {}

	static fromPrimitives(data: IRole): RoleEntity {
		return new RoleEntity(
			data.id,
			data.name,
			data.code,
			data.description,
			data.active,
			data.created_at,
			data.updated_at,
			data.permissions || []
		);
	}

	static create(data: ICreateRole): RoleEntity {
		return new RoleEntity(
			null, // ID will be assigned by backend
			data.name,
			data.code,
			data.description,
			data.active,
			null,
			null,
			data.permissions || []
		);
	}

	static update(id: number, data: IUpdateRole): RoleEntity {
		return new RoleEntity(
			id, 
			data.name, 
			data.code, 
			data.description, 
			data.active, 
			null,
			null,
			data.permissions || []
		);
	}

	toPlainObject(): any {
		return {
			id: this.id,
			name: this.name,
			code: this.code,
			description: this.description,
			active: this.active,
			permissions: this.permissions || [],
			created_at: this.created_at,
			updated_at: this.updated_at
		};
	}
}
