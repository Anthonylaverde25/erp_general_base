import { injectable } from 'inversify';
import { IRoleCrudRepository } from '@/domain/entities/roles/repositories/role.interface.crud';
import { RoleEntity } from '@/domain/entities/roles/Role';
import { RoleMapper } from '@/domain/entities/roles/Mappers/RoleMapper';
import axiosInstance from '@/lib/@axios';

@injectable()
export class RoleRepositoryCrud implements IRoleCrudRepository {
	async index(): Promise<RoleEntity[]> {
		const {
			data: { roles, meta, links }
		} = await axiosInstance.get('/roles');
		return RoleMapper.fromDetailDTOList(roles);
	}

	async create(data: RoleEntity): Promise<{ role: RoleEntity; message: string }> {
		const payload = data.toPlainObject();
		const {
			data: { role, message }
		} = await axiosInstance.post('/roles', payload);

		return {
			role: RoleMapper.fromDetailDTO(role),
			message: message || 'Rol creado correctamente'
		};
	}

	async update(id: number, data: RoleEntity): Promise<{ role: RoleEntity; message: string }> {
		const payload = data.toPlainObject();
		const {
			data: { role, message }
		} = await axiosInstance.put(`/roles/${id}`, payload);

		return {
			role: RoleMapper.fromDetailDTO(role),
			message: message || 'Rol actualizado correctamente'
		};
	}
}
