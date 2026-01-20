import { Role } from '@/types/role.types';

export class RoleEntity implements Role {
	constructor(
		public id: number,
		public name: string,
		public code: string,
		public description: string,
		public status: boolean,
		public created_at?: string,
		public updated_at?: string
	) {}

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
}
