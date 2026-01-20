import { UserListDTO } from '../DTOs/UserListDTO';
import { User } from '../User';
import { UserType } from '@/types/user.types';

export class UserMapper {
	static fromDetailDTO(dto: UserListDTO): User {
		const data = {
			id: dto.id,
			name: dto.name,
			email: dto.email,
			phone: dto.phone || '',
			role: dto.role,
			role_id: dto.role?.id || (dto.role_ids?.[0] ?? 0)
		};
		return new User(data);
	}

	static fromDetailDTOList(dto: UserListDTO[]): User[] {
		return dto.map((dto) => this.fromDetailDTO(dto));
	}

	/**
	 * Converts a User domain entity to a plain UserType object
	 * for use in UI components and forms
	 */
	static toUserType(user: User): UserType {
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
