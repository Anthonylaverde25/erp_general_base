import { UserListDTO } from '../DTOs/UserListDTO';
import { UserEntity } from '../User';
import { IUser } from '@/types/user.types';

export class UserMapper {
	static fromDetailDTO(dto: UserListDTO): UserEntity {
		return new UserEntity({
			id: dto.id,
			name: dto.name,
			email: dto.email,
			role: dto.role,
			phone: dto.phone || '', // Keep original logic for phone default
			role_id: dto.role?.id || (dto.role_ids?.[0] ?? 0) // Keep original logic for role_id
		});
	}

	static fromDetailDTOList(dto: UserListDTO[]): UserEntity[] {
		return dto.map((user) => UserMapper.fromDetailDTO(user));
	}

	/**
	 * Converts a User domain entity to a plain IUser object
	 * for use in UI components and forms
	 */
	static toUser(user: UserEntity): IUser {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			role_id: user.role_id
		};
	}
}
