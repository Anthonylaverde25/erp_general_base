import { RoleEntity } from '../Role';

export interface IRoleCrudRepository {
	index(): Promise<RoleEntity[]>;
	create(data: RoleEntity): Promise<{ role: RoleEntity; message: string }>;
	update(id: number, data: RoleEntity): Promise<{ role: RoleEntity; message: string }>;
}
