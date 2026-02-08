import { IUser } from '@/types/user.types';
import { UserEntity } from '../User';

export interface IUserCrudRepository {
	index(): Promise<UserEntity[]>;
	show(id: IUser['id']): Promise<UserEntity>
	create(data: UserEntity): Promise<{ user: UserEntity; message: string }>;
	update(id: number, data: UserEntity): Promise<{ user: UserEntity; message: string }>;
	remove(id: number): Promise<{ message: string }>;
}
