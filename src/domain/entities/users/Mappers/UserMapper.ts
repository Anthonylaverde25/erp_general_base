import { UserListDTO } from "../DTOs/userListDTO";
import { User } from "../User";

export class UserMapper {

    static fromDetailDTO(dto: UserListDTO): User {
        const data = {
            id: dto.id,
            name: dto.name,
            email: dto.email,
            phone: dto.phone || '',
            role: dto.role,
            ...(dto.role_ids && { role_ids: dto.role_ids })
        }
        return new User(data)
    }

    static fromDetailDTOList(dto: UserListDTO[]): User[] {
        return dto.map(dto => this.fromDetailDTO(dto))
    }

} 