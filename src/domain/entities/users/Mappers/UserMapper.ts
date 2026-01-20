import { UserListDTO } from "../DTOs/UserListDTO";
import { User } from "../User";

export class UserMapper {

    static fromDetailDTO(dto: UserListDTO): User {
        const data = {
            id: dto.id,
            name: dto.name,
            email: dto.email,
            phone: dto.phone || '',
            role: dto.role,
            role_id: dto.role?.id || (dto.role_ids?.[0] ?? 0)
        }
        return new User(data)
    }

    static fromDetailDTOList(dto: UserListDTO[]): User[] {
        return dto.map(dto => this.fromDetailDTO(dto))
    }

} 