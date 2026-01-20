import { UserType } from '@/types/user.types';
import { User } from '../User';

export interface IUserCrudRepository {
	index(): Promise<User[]>;
	show(id: UserType['id']): Promise<User>
	create(data: User): Promise<{ user: User; message: string }>;
	update(id: number, data: User): Promise<{ user: User; message: string }>;
}
