import { injectable } from 'inversify';
import { IRoleCrudRepository } from '@/domain/entities/roles/repositories/role.interface.crud';
import { RoleEntity } from '@/domain/entities/roles/Role';
import { RoleMapper } from '@/domain/entities/roles/Mappers/RoleMapper';
import axiosInstance from '@/lib/@axios';
import { IRole } from '@/types/role.types';

@injectable()
export class RoleRepositoryCrud implements IRoleCrudRepository {
	async index(): Promise<RoleEntity[]> {
		const {
			data: { roles, meta, links }
		} = await axiosInstance.get('/roles');
		return RoleMapper.fromDetailDTOList(roles);
	}

	async show(id: IRole['id']): Promise<RoleEntity> {
		try {
			const {
				data: { role }
			} = await axiosInstance.get(`/roles/${id}`);
			console.log('role desde el repo', role);
			return RoleMapper.fromDetailDTO(role);
		} catch (error) {
			throw error;
		}
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
