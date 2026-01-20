import { UpdateUserType } from '@/types/user.types';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { User } from '@/domain/entities/users/User';

@injectable()
export class UpdateUserUseCase {
    constructor(@inject(TYPES.IUserCrudRepository) private repository: IUserCrudRepository) { }

    async execute(id: number, data: UpdateUserType): Promise<{ user: User; message: string }> {
        const user = User.update(id, data);
        return this.repository.update(id, user);
    }
}
