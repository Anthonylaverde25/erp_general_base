import { Role, CreateRoleType, UpdateRoleType } from '@/types/role.types';

export class RoleEntity implements Role {
	constructor(
		public id: number,
		public name: string,
		public code: string,
		public description: string,
		public status: boolean,
		public created_at?: string,
		public updated_at?: string
	) { }

	static fromPrimitives(data: Role): RoleEntity {
		return new RoleEntity(
			data.id,
			data.name,
			data.code,
			data.description,
			data.status,
			data.created_at,
			data.updated_at
		);
	}

	static create(data: CreateRoleType): RoleEntity {
		return new RoleEntity(
			0, // ID will be assigned by backend
			data.name,
			data.code,
			data.description,
			data.status
		);
	}

	static update(id: number, data: UpdateRoleType): RoleEntity {
		return new RoleEntity(
			id,
			data.name,
			data.code,
			data.description,
			data.status
		);
	}

	toPlainObject(): any {
		return {
			id: this.id,
			name: this.name,
			code: this.code,
			description: this.description,
			status: this.status,
			created_at: this.created_at,
			updated_at: this.updated_at
		};
	}
}
